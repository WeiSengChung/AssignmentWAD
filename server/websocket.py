from flask import Flask
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True 
socketio = SocketIO(app)

# WebSocket event listeners
@socketio.on('connect', namespace='/orders')
def handle_connect_orders():
    print('Client connected to /orders')

@socketio.on('calculate_order', namespace='/orders')
def handle_calculate_order(data):
    print(f"Received data for calculation: {data}")
    
    try:
        order_items = data.get('order_items', [])
        print(f"Order items: {order_items}")

        order_value = calculate_order_value(order_items)
        delivery_fee = calculate_delivery_fee(order_value)
        total = calculate_total(order_value, delivery_fee)

        print(f"Order Value: {order_value}, Delivery Fee: {delivery_fee}, Total: {total}")

        response = {
            'order_value': order_value,
            'delivery_fee': delivery_fee,
            'total': total
        }
        emit('calculation_success', json.dumps(response), namespace="/orders")
    except Exception as e:
        print(f"Error calculating order: {str(e)}")
        emit('calculation_error', {'message': f'Error calculating order: {str(e)}'})

@socketio.on('disconnect', namespace='/orders')
def handle_disconnect_orders():
    print('Client disconnected from /orders')

# Helper functions for order calculation
def calculate_order_value(order_items):
    total_order_value = 0
    for item in order_items:
        try:
            price = float(item.get('price', 0))
            quantity = int(item.get('quantity', 0))
            total_order_value += price * quantity
        except (ValueError, TypeError):
            raise ValueError("Invalid price or quantity in order item")
    return total_order_value

def calculate_delivery_fee(order_value):
    return round(order_value * 0.06, 2)

def calculate_total(order_value, delivery_fee):
    return round(order_value + delivery_fee, 2)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5003)
