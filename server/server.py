import sqlite3
from flask import Flask, jsonify, request, abort, send_file
from argparse import ArgumentParser
import base64
import os

DB = 'db.sqlite'

def orders_get_rows_as_dict(row):
    row_dict = {
        'order_id': row[0],
        'product_id': row[1],
        'customer_id': row[2],
        'size': row[3],
        'color': row[4],
        'quantity': row[5],
        'price': row[6],
        'address': row[7],
        'status': row[8]
    }
    return row_dict 


def clothes_get_rows_as_dict(row):
    row_dict = {
        'product_id': row[0],
        'customer': row[1],
        'clothesCategories': row[2],
        'product_name': row[3],
        'product_price': row[4],
    }
    return row_dict


def display_clothes_get_rows_as_dict(row):
    row_dict = {
        'product_id': row[0],
        'product_name': row[1],
        'product_price': row[2],
        'clothesCategories':row[3],
    }
    return row_dict


app = Flask(__name__)
    
def customer_get_rows_as_dict(row):
    row_dict = {
        'customer_id': row[0],
        'name': row[1],
        'username': row[2],
        'password': row[3],
    }
    return row_dict


@app.route('/api/customer/<username>', methods=['GET'])
def get_user(username):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM customer WHERE username=?', (username,))
    row = cursor.fetchone()
    db.close()

    if row:
        row_as_dict = customer_get_rows_as_dict(row)
        return jsonify(row_as_dict), 200
    else:
        return jsonify(None), 200


@app.route('/api/customer', methods=['POST'])
def store_user():
    if not request.json:
        abort(404)

    new_user = (
        request.json['name'],
        request.json['username'],
        request.json['password'],
        request.json['address'],
        request.json['email']
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO customer(name,username,password,address,email)
        VALUES(?,?,?,?,?)
    ''', new_user)

    customer_id = cursor.lastrowid

    db.commit()

    response = {
        'customer_id': customer_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/customer/<username>', methods=['PUT'])
def update_user(username):
    if not request.json:
        abort(400)

    if 'username' not in request.json:
        abort(400)

    if request.json['username'] != username:
        abort(400)

    update_user = (
        request.json['name'],
        request.json['password'],
        username,
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE customer SET name=?, password=? WHERE username=?
    ''', update_user)

    db.commit()

    response = {
        'username': username,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/customer/<username>', methods=['DELETE'])
def delete(username):
    if not request.json:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM customer WHERE username=?', (username,))

    db.commit()

    response = {
        'username': username,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201


@app.route('/api/clothesSelection', methods=['GET'])
def get_clothes():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM clothesSelection')
    row = cursor.fetchone()
    db.close()

    row_as_dict = [clothes_get_rows_as_dict(row) for row in row]
    print(row_as_dict)
    return jsonify(row_as_dict), 200

@app.route('/api/clothesSelection/<product_id>', methods=['GET'])
def get_clothes_details(product_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    
    # Fetch a single row using `fetchone()`
    cursor.execute('SELECT * FROM clothesSelection WHERE product_id = ?', (product_id,))
    row = cursor.fetchone()
    db.close()

    if row:
        # Convert the row to a dictionary
        product = clothes_get_rows_as_dict(row)
        return jsonify(product), 200  # Return the dictionary as JSON
    else:
        # If no product is found, return a 404
        return jsonify({'error': 'Product not found'}), 404


@app.route ('/api/clothesSelection/<customer>/<category>', methods = ['GET'])
def get_clothes_selection(customer, category):

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
    SELECT product_id,product_name,product_price,clothesCategories
    FROM clothesSelection
    WHERE customer= ? AND clothesCategories = ?
''',(customer,category))
    
    rows = cursor.fetchall()
    print(rows)
    db.close()

    products = [display_clothes_get_rows_as_dict(row) for row in rows]
    return jsonify(products), 200   


@app.route('/api/clothesCategories/<product>', methods=['GET'])
def show_clothes(product):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM clothesSelection WHERE product_id=?', (product,))
    row = cursor.fetchone()
    db.close()

    if row:
        return jsonify(clothes_get_rows_as_dict(row)), 200
    else:
        abort(404)


@app.route('/api/orders/<customer_id>/<status>', methods=['GET'])
def get_orders(customer_id, status):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orders WHERE customer_id=? AND status = ? ORDER BY order_id DESC', (customer_id,status,))
    rows = cursor.fetchall()
    db.close()

    orders = [orders_get_rows_as_dict(row) for row in rows]
    return jsonify(orders), 200


@app.route('/api/orders', methods=['POST'])
def store_order():
    if not request.json:
        abort(400)

    # Get the data from the request JSON body
    new_order = (
        request.json['product_id'],
        request.json['customer_id'],
        request.json['size'],
        request.json['color'],
        request.json['quantity'],
        request.json['price'],
        request.json['address'],
        request.json['status']
    )

    # Connect to the SQLite database
    db = sqlite3.connect(DB)
    cursor = db.cursor()

    # Insert the new order into the orders table
    cursor.execute('''
        INSERT INTO orders(product_id, customer_id, size, color, quantity, price, address, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', new_order)

    # Retrieve the last inserted order ID
    order_id = cursor.lastrowid

    # Commit the transaction
    db.commit()

    # Prepare the response
    response = {
        'order_id': order_id,
        'affected': db.total_changes,
    }

    # Close the database connection
    db.close()

    return jsonify(response), 201

@app.route('/api/orders/<int:order_id>', methods=['PUT'])
def updateOrders(order_id):
    if not request.json:
        abort(400)

    if 'order_id' not in request.json:
        abort(400)

    if int(request.json['order_id']) != order_id:
        abort(400)

    update_order = (
        request.json['status'],
        request.json['order_id']
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        UPDATE orders SET status=?
        WHERE order_id=?
    ''', update_order)

    db.commit()

    response = {
        'id': order_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/orders/<int:order_id>', methods=['DELETE'])
def deleteOrder(order_id):
    if not request.json:
        abort(400)

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM orders WHERE order_id=?', (str(order_id),))

    db.commit()

    response = {
        'order_id': order_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201



if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port)