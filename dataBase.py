import sqlite3

# Connect to the database
db = sqlite3.connect('db.sqlite')

db.execute('DROP TABLE IF EXISTS customer')
db.execute('DROP TABLE IF EXISTS customer_info')
db.execute('DROP TABLE IF EXISTS product')
db.execute('DROP TABLE IF EXISTS productsClothes')
db.execute('DROP TABLE IF EXISTS productsClothes2')
db.execute('DROP TABLE IF EXISTS productsAccessories')
db.execute('DROP TABLE IF EXISTS products')
db.execute('DROP TABLE IF EXISTS orders')
db.execute('DROP TABLE IF EXISTS feedbacks')
db.execute('DROP TABLE IF EXISTS clothesSelection')

# Create tables
db.execute('''
    CREATE TABLE IF NOT EXISTS customer(
        customer_Id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
''')

db.execute('''
    CREATE TABLE IF NOT EXISTS clothesSelection (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        clothesCategories TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL
    )
''')

db.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        size TEXT NOT NULL,
        color TEXT NOT NULL,
        quantity TEXT NOT NULL,
        price TEXT NOT NULL,
        address TEXT NOT NULL,
        status TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES clothesSelection(product_id),
        FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
    )
''')

db.execute('''
    CREATE TABLE IF NOT EXISTS feedbacks (
        feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
        feedback TEXT NOT NULL
    )
''')


# Insert customer data
cursor = db.cursor()

cursor.execute('''
    INSERT INTO customer(name, username, password, address, email)
    VALUES('Tan Aik Suan', 'AS123', 'as1234', '59, Jalan SL2,Taman Sungai Long', 'As123@gmail.com')
''')

cursor.execute('''
    INSERT INTO customer(name, username, password, address, email)
    VALUES('Chia XuanYing', 'XY123', 'xy1234','23, Jalan SL1,Taman Sungai Long', 'Xy123@gmail.com')
''')

cursor.execute('''
    INSERT INTO customer(name, username, password, address, email)
    VALUES('Chung Wei Seng', 'WS123', 'ws1234','54, Jalan SL9,Taman Sungai Long', 'Ws123@gmail.com')
''')

cursor.execute('''
    INSERT INTO customer(name, username, password, address, email)
    VALUES('Ooi Chien How', 'CH123', 'ch1234','100, Jalan SL6,Taman Sungai Long', 'Ch123@gmail.com')
''')


# # Commit the transaction
# db.commit()

clothesCategories = {
    "Men": {
        "top": {
            "t_shirt" : ["Bold Stripes T-shirt", "Classic Creeeck T-shirt","Urban Essentials T-shirt","Vintage Cotton T-shirt","Everyday Comfort T-shirt"],
            "long_sleeve" : ["Classic Henley","Thermal Knit Long Sleeve", "Slim Fit Pullover", "WInter Warmth Long Sleeve", "Essential Layering Top"],
            "hoodies": ["Urban Comfort Hoodie", "Classic Zip-Up Hoodie", "Relaxed Fit Hoodie", "Adventure Pullover Hoodie", "Cozy Fleece Hoodie"],
            "sweatshirt" : ["Vintage Crewneck Sweatshirt", "Rugged Outdoor Sweatshirt", "Comfy Cotton Sweatshirt", "Retro Sport Sweatshirt", "Casual Fleece Sweatshirt"],
            "ut":["Retro Graphic T-shirt", "Pop Culture Print T-shirt", "Street Style Graphic t-shirt", "Artistic Expression T-shirt","Bold Statement T-shirt"],
        },
        "bottom" : {
            "jeans" : ["Slim Fit Denim", "Classic Staright Leg Jeans", "Distressed Denim Jeans", "Vintage Wash Jeans","Stretch Comfort Jeans"],
            "long_pants":["City Cargo Pants","Slim Fit Long Pants","tailored Joggers","relaxed Ft Cotton Pants","tech Stretch Pants"],
            "shorts" : ["Sporty Cargo Shorts", "Classic Denim Short", "Athletic Mesh Shorts","Relaxed Fit Chino Shorts", "Lightweight Summer Shorts"],
            "chinos":["Tailored Chino ", "Classic Stretch Chinos","SLim Fot Chino Pants","Cotton Twill Chinos", "Flat-Front Chino Pants"],
            "ankle_pants" : ["Modern Fit Ankle Pants", "Slim Stretch Ankle pants","Cropped Casual Pants","tailored Stretch Ankle Pants","Minimalist Ankle Pants"],
        }
    },
    "Women": {
        "top":{
            "t_shirt":["Flowy V-Nec","Relaxed Fit Crewneck T-shirt","Classic Cotton T-shirt","Soft Modal t-shirt","Feminine Fit T-shirt"],
            "long_sleeve":["Elegant Ribbed Top","Cozy Knit Long Sleeve","Lightweight Layering Top","Classic Scoop Neck Long Sleeve","Stretch Cotton Long Sleeve"],
            "hoodies":["Cozy Zip-Up Hoodie","Chic Pullover Hoodie","Relaxed Fit Hoodie","Everyday Essential Hoodie","Soft Fleece Hoodie"],
            "sweatshirt": ["Comfy Oversized Sweatshirt","Classic Crewneck Sweatshirt","Lightweight Pullover Sweatshirt","Cozy Cotton Sweatshirt","Vintage-Inspired Sweatshirt"],
            "blouses" : ["Silky Button-Down Blouse","Chiffon Ruffle Blouse","Elegant Wrap Blouse","Boho Floral Blouse","Tailored Office Blouse"],
        },
        "bottom": {
            "shorts":["Casual High-Waist Shorts","Denim Cut-Off Shorts","Relaxed Fit Linen Shorts","Tailored Chino Shorts","Athletic Mesh Shorts"],
            "jeans":["Skinny Fit Stretch Jeans","High-Rise Vintage Jeans","Wide Leg Denim","Distressed Skinny Jeans","Classic Straight-Leg Jeans"],
            "casual_pants":["Relaxed Fit Lounge Pants","Drawstring Jogger Pants","Wide-Leg Palazzo Pants","Lightweight Cotton Pants","Tapered Leg Pants"],
            "long_pants":["Tapered Leg Trousers","Slim Fit Dress Pants","Wide-Leg Ankle Pants","Tailored Office Trousers","Stretch Slim Fit Pants"],
            "legging":["Activewear High-Rise Leggings","Seamless Yoga Leggings","Fleece-Lined Winter Leggings","Sculpting Compression Leggings","Printed Performance Leggings"],
        }

    },
    "Kids": {
        "top": {
            "t_shirt":["Fun Graphic Tee","Rainbow Print Tee","Animal Friends Tee","Colorful Stripes Tee","Dino Adventure T-shirt"],
            "long_sleeve":["Playtime Long Sleeve","Warm Cotton Long Sleeve","Adventure Ready Long Sleeve","Striped Cozy Top","Cartoon Print Long Sleeve"],
            "hoodies":["Adventure Pullover Hoodie","Fun Print Zip-Up Hoodie","Cozy Fleece Hoodie","Bold Colors Hoodie","Playground Favorite Hoodie"],
            "sweatshirt":["Cozy Graphic Sweatshirt","Cool Weather Pullover","Playground Fun Sweatshirt","Playground Fun Sweatshirt","Comfy Crewneck Sweatshirt"],
            "ut":["Cartoon Print Tee","Superhero Graphic Tee","Animal Kingdom Tee","Space Explorer T-shirt","Rainbow Adventure Tee"],
        },
        "bottom": {
            "jeans":["Rugged Stretch Jeans","Comfy Elastic Waist Jeans","Adventure-Ready Denim","Relaxed Fit Jeans","Classic Straight Leg Jeans"],
            "long_pants":["Explorer Cargo Pants","Elastic Waist Jogger Pants","Cozy Knit Pants","Durable Playtime Pants","Slim Fit Adventure Pants"],
            "shorts":["Playground Ready Shorts","Comfy Cotton Shorts","Bold Colors Cargo Shorts","Lightweight Summer Shorts","Activewear Running Shorts"],
            "chinos":["Smart Kid Chinos","Elastic Waist Chino Pants","Classic Fit Chino Shorts","Durable School Chinos","Tailored Fit Chino Pants"],
            "jogger":["Comfy Drawstring Joggers","Adventure Stretch Joggers","Elastic Waist Joggers","Warm Fleece Joggers","Playground Ready Joggers"]
        }
    }
}

price_mapping = {
    "Men": {
        "top" :{
            "t_shirt" : 59.90,
            "long_sleeve" : 47.90,
            "hoodies":79.90,
            "sweatshirt": 69.90,
            "ut": 125.90,
        },
        "bottom" :{
            "jeans": 59.90,
            "long_pants":75.90,
            "shorts": 88.90,
            "chinos": 47.90,
            "ankle_pants":35.90,
        }
    },
    "Women": {
        "top" :{
            "t_shirt" : 59.90,
            "long_sleeve" : 50.90,
            "hoodies":85.90,
            "sweatshirt": 59.90,
            "blouses": 97.90,
        },
        "bottom" :{
            "shorts": 49.90,
            "jeans":59.90,
            "casual_pants": 65.90,
            "long_pants": 47.90,
            "legging":40.90,
        }
    },
    "Kids": {
        "top" :{
            "t_shirt" : 35.90,
            "long_sleeve" : 64.90,
            "hoodies":73.90,
            "sweatshirt": 89.90,
            "ut": 119.90,
        },
        "bottom" :{
            "jeans": 58.90,
            "long_pants":70.90,
            "shorts": 60.90,
            "chinos": 39.90,
            "jogger":48.90,
        }
    }
}

for customer, item_types in clothesCategories.items():
    for item_type, items in item_types.items():
        for sub_category, item_names in items.items():
            for idx, item in enumerate(item_names):
                price = price_mapping[customer][item_type][sub_category]
                # image = imagePath[customer][item_type][sub_category][idx]
                cursor.execute('''
                    INSERT INTO clothesSelection (customer, clothesCategories, product_name, product_price)
                    VALUES (?, ?, ?, ?)
                ''', (customer, sub_category, item, price))




db.commit()
db.close()