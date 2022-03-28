$("#guess_submit").on('click', handleSubmit)
const $response_sec = $('#response_sec')
const $guess_input = $('#guess')
const $html_score = $('#score')
const $html_timer = $('#timer')
const $html_highscore = $('#high_score')
const $games_played = $('#games_played')
let game_score = 0;
const guess_list = new Array();

async function handleSubmit(event) {
    event.preventDefault()
    let guess = $guess_input.val().toString()
    if (guess_list.indexOf(guess) === -1) {
        let response = await axios.post('/guess', {
            word_guess: `${guess}`
        });
        let check_word = response.data['result'];
        guess_feedback(check_word);
        let valid_word = get_word_score(check_word);
        if (valid_word) {
            game_score = game_score + (word_score(guess));
            $html_score.text(`${game_score}`);
            guess_list.push(guess)
        }
    }
    else {
        guess_feedback('word-already-guessed')
    }
}

function guess_feedback(check) {
    $response_sec.empty();
    $guess_input.val("");
    let h2 = $('<h2>');
    if (check === 'not-on-board') {
        h2.text('That word is not on the board');
    }
    else if (check === 'not-word') {
        h2.text('That is not a valid word');
    }
    else if (check === 'word-already-guessed') {
        h2.text('You already guessed that word!');
    }
    else {
        h2.text('Valid word!');
    }

    $response_sec.append(h2);
}

function get_word_score(check) {
    if (check === 'not-on-board' || check === 'not-word') {
        return false
    }
    return true
}

function word_score(word) {
    let word_score = word.length;
    return word_score
}

function timer() {
    let timer = setInterval(() => {
        let sec = parseInt($html_timer.text());
        if (sec > 0) {
            sec--;
            $html_timer.text(sec);
        }
        else {
            end_game();
            clearInterval(timer);
        }
    }, 1000);
}

function end_game() {
    $('#guess_submit').off('click', handleSubmit);
    $('#guess_submit').on('click', (event) => { event.preventDefault() });
    check_highscore();
    increment_games_played();
    update_session();
}

function increment_games_played() {
    let gp = parseInt($games_played.text());
    gp += 1;
    $games_played.text(gp)
}

function check_highscore() {
    hs = parseInt($html_highscore.text());
    if (hs < parseInt($html_score.text())) {
        $html_highscore.text($html_score.text())
    }
}

async function update_session() {
    // POSTs high score + games played to backend for session update
    let hs = $html_highscore.text();
    let gp = $games_played.text();
    let response_promise = axios.post('/', {
        high_score: `${hs}`, games_played: `${gp}`
    });
    let response = await response_promise
    console.log(response)
}

window.onload = () => {
    timer();
}