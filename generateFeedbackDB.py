##
# Execute this script once to create the database & table
# as well as populating it with initial data
#

import sqlite3
db = sqlite3.connect('feedbackdb.sqlite')

db.execute('DROP TABLE IF EXISTS feedback')

db.execute('''CREATE TABLE feedback(
    id integer PRIMARY KEY AUTOINCREMENT ,
    name text NOT NULL,
    message text NOT NULL,
    stars_count integer NOT NULL,
    image text NOT NULL
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO feedback(name, message, stars_count, image)
    VALUES('Julia', 'The quality of this attire is exceptional; it feels durable and well-made.', 4, './img/julie.png')
''')
cursor.execute('''
    INSERT INTO feedback(name, message, stars_count, image)
    VALUES('Emerson', "I love the design of this outfit; it's stylish and unique.", 4, './img/emerson.png')
''')
cursor.execute('''
    INSERT INTO feedback(name, message, stars_count, image)
    VALUES('Felix', 'The fashion follows this Application.', 5, './img/pewds.png')
''')
db.commit()
db.close()
