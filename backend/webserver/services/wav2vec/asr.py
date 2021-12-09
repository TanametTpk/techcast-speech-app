import librosa
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

from pythainlp import correct
from itertools import groupby

import kenlm
from pyctcdecode import build_ctcdecoder

import os
import pathlib

fileLocation = pathlib.Path(__file__).parent.resolve()

processor = Wav2Vec2Processor.from_pretrained("airesearch/wav2vec2-large-xlsr-53-th")
model = Wav2Vec2ForCTC.from_pretrained("airesearch/wav2vec2-large-xlsr-53-th")

model.to("cuda")

raw_vocab = processor.tokenizer.get_vocab()
vocab_list = list(raw_vocab)
vocab_dict = processor.tokenizer.get_vocab()
sort_vocab = sorted((value, key) for (key,value) in vocab_dict.items())
vocab = [x[1].replace("|", " ") if x[1] not in processor.tokenizer.all_special_tokens else "" for x in sort_vocab]

language_model = kenlm.Model(os.path.join(fileLocation,'./lm/th_word_lm_4ngram.binary'))
decoder = build_ctcdecoder(vocab[:-2], language_model, alpha=0.5, beta=2.0, ctc_token_idx=69)

def word_correction(sentence):
    newText = ""
    for subword in sentence.split(" "):
        if len(newText) > 0:
            newText += " " + correct(subword)
        else:
            newText = correct(subword)
    return newText

def transcribe(file):
    speech, rate = librosa.load(file)
    speech = librosa.resample(speech, rate, 16_000)
    input_values = processor(speech, return_tensors = 'pt', sampling_rate=16_000).input_values
    with torch.no_grad():
        logits = model(input_values.to("cuda")).logits.cpu().detach().numpy()[0]

    return decoder.decode(logits, beam_width=500)

def transcribe_byte(wav_byte, sampling_rate = 16_000):
    if sampling_rate != 16_000:
        wav_byte = librosa.resample(wav_byte, sampling_rate, 16_000)

    input_values = processor(wav_byte, return_tensors = 'pt', sampling_rate=16_000).input_values

    with torch.no_grad():
        logits = model(input_values.to("cuda")).logits.cpu().detach().numpy()[0]

    return decoder.decode(logits, beam_width=500)

def transcribe_with_timestamp(file):
    speech, rate = librosa.load(file)
    sample_rate = 16_000
    speech = librosa.resample(speech, rate, sample_rate)
    inputs = processor(speech, sampling_rate=sample_rate, return_tensors="pt", padding=True)
    with torch.no_grad():
        logits = model(inputs.input_values.to("cuda")).logits

    predicted_ids = torch.argmax(logits, dim=-1)
    # transcription = decoder.decode(logits.cpu().detach().numpy()[0], beam_width=500)
    transcription = processor.decode(predicted_ids[0])

    ##############
    # this is where the logic starts to get the start and end timestamp for each word
    ##############
    words = [w for w in transcription.split(' ') if len(w) > 0]
    predicted_ids = predicted_ids[0].tolist()
    duration_sec = inputs.input_values.shape[1] / sample_rate

    ids_w_time = [(i / len(predicted_ids) * duration_sec, _id, i) for i, _id in enumerate(predicted_ids)]
    # remove entries which are just "padding" (i.e. no characers are recognized)
    # scores = [scores[i] / numberOfChar[i] for i in range(len(ids_w_time)) if ids_w_time[i][1] != processor.tokenizer.pad_token_id]
    ids_w_time = [i for i in ids_w_time if i[1] != processor.tokenizer.pad_token_id]
    # now split the ids into groups of ids where each group represents a word
    split_ids_w_time = [list(group) for k, group
                        in groupby(ids_w_time, lambda x: x[1] == processor.tokenizer.word_delimiter_token_id)
                        if not k]

    # print(len(scores))
    possibilities = logits.cpu().detach().numpy()
    scores = []
    for itemGroup in split_ids_w_time:
        totalScore = 0
        for item in itemGroup:
            totalScore += possibilities[0][item[2]][item[1]]
        scores.append(totalScore / len(itemGroup))

    assert len(split_ids_w_time) == len(words)  # make sure that there are the same number of id-groups as words. Otherwise something is wrong
    assert len(split_ids_w_time) == len(scores)

    word_start_times = []
    word_end_times = []
    for cur_ids_w_time, cur_word in zip(split_ids_w_time, words):
        _times = [_time for _time, _id, _ in cur_ids_w_time]
        word_start_times.append(min(_times))
        word_end_times.append(max(_times))
        
    return words, word_start_times, word_end_times, scores