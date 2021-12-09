from flask import Blueprint

main = Blueprint('main', __name__)

from . import macroController
from .winput import *