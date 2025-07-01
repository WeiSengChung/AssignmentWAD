import sqlite3

# Connect to the database
db = sqlite3.connect('productdb.sqlite')

db.execute('DROP TABLE IF EXISTS clothesSelection')
db.execute('DROP TABLE IF EXISTS orders')

db.execute('''
    CREATE TABLE IF NOT EXISTS clothesSelection (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        clothesCategories TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        product_image TEXT NOT NULL  -- Add the product_image column here
    )
''')

db.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES productsClothes(product_id),
        FOREIGN KEY(product_id) REFERENCES productsAccessories(product_id),
        FOREIGN KEY(username) REFERENCES customer(username)
    )
''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO clothesSelection(clothesCategories, product_name, product_price, product_image)
    VALUES('Ooi Chien How', 'CH123', 'ch1234','100, Jalan SL6,Taman Sungai Long', 'Ch123@gmail.com')
''')