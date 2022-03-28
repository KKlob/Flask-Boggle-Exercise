from unittest import TestCase
from urllib import response
from app import app
from flask import session, json
from boggle import Boggle


class FlaskTests(TestCase):
    """Tests for app.py of boggle app"""

    def test_homepage(self):
        with app.test_client() as client:
            resp = client.get('/')
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(session['board'])

    def test_update_session(self):
        with app.test_client() as client:
            resp = client.post(
                '/', data=json.dumps(dict(high_score='20', games_played='2')), content_type='application/json')

            self.assertEqual(resp.status_code, 200)
            self.assertTrue(session['high_score'])
            self.assertTrue(session['games_played'])

    def test_guess_logic(self):
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = Boggle().make_board()

            resp = client.post(
                '/guess', data=json.dumps(dict(word_guess='dog')), content_type='application/json')
            self.assertEqual(resp.status_code, 200)
            result = json.loads(resp.data)['result']
            self.assertIn(result, ['not-on-board', 'not-word', 'ok'])
