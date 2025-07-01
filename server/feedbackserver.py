import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'feedbackdb.sqlite'


def get_row_as_dict(row):
    row_dict = {
        'name': row[1],
        'message': row[2],
        'stars_count': row[3],
        'image': row[4],
    }

    return row_dict

app = Flask(__name__)


@app.route('/api/feedback', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM feedback ORDER BY id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    rows_as_dict = []
    for row in rows:
        row_as_dict = get_row_as_dict(row)
        rows_as_dict.append(row_as_dict)

    return jsonify(rows_as_dict), 200

@app.route('/api/feedback', methods=['POST'])
def store_feedback():
    if not request.json:
        abort(404)

    new_feedback = (
        request.json['name'],
        request.json['message'],
        request.json['stars_count'],
        request.json['image'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO feedback(name,message,stars_count,image)
        VALUES(?, ?, ?, ?)
    ''', new_feedback)

    feedback_id = cursor.lastrowid

    db.commit()

    response = {
        'feedback_id': feedback_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201



if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5001, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)