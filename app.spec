# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files
from PyInstaller.utils.hooks import copy_metadata

datas = [('E:\\anaconda\\envs\\speech-app\\Lib\\site-packages\\librosa\\util\\example_data', 'librosa\\util\\example_data'), ('E:\\anaconda\\envs\\speech-app\\Lib\\site-packages\\pythainlp\\corpus', 'pythainlp\\corpus'), ('D:\\projects\\techcast-speech-app\\backend\\webserver\\services\\macro', 'services\\macro'), ('D:\\projects\\techcast-speech-app\\backend\\webserver\\services\\wav2vec\\lm', 'services\\wav2vec\\lm')]
datas += collect_data_files('torch')
datas += copy_metadata('torch')
datas += copy_metadata('tqdm')
datas += copy_metadata('regex')
datas += copy_metadata('sacremoses')
datas += copy_metadata('requests')
datas += copy_metadata('packaging')
datas += copy_metadata('filelock')
datas += copy_metadata('numpy')
datas += copy_metadata('tokenizers')
datas += copy_metadata('importlib_metadata')
datas += copy_metadata('dataclasses')


block_cipher = None


a = Analysis(['backend\\webserver\\app.py'],
             pathex=['E:\\anaconda\\envs\\speech-app\\Lib\\site-packages\\torch\\lib'],
             binaries=[],
             datas=datas,
             hiddenimports=['engineio.async_gevent', 'engineio.async_threading', 'engineio.async_eventlet'],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)

exe = EXE(pyz,
          a.scripts, 
          [],
          exclude_binaries=True,
          name='app',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas, 
               strip=False,
               upx=True,
               upx_exclude=[],
               name='app')
