from boggle import Boggle
from flask import Flask, request, render_template, session, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "supersecretkeyword"

#debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/')
def base_game_page():
    """Setup base page for boggle game. Add board to session"""
    session["board"] = boggle_game.make_board()
    return render_template('game_form.jinja')


@app.route('/', methods=['POST'])
def update_session():
    """updateds session with high score and games played"""
    update_json = request.get_json()
    session['high_score'] = update_json['high_score']
    session['games_played'] = update_json['games_played']
    return 'session updated'


@app.route('/guess', methods=["POST"])
def guess_logic():
    """Receives word_guess and checks if valid. returns result of 
    1) 'not-word'
    2) 'not-on-board'
    3) 'ok'
    """
    guess_json = request.get_json()
    guess = guess_json['word_guess']
    check_word = boggle_game.check_valid_word(session['board'], guess)
    return jsonify(result=check_word)
