from flask import Flask, jsonify
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/stats', methods=['GET'])
def get_stats():
    # Data for June and July
    june_data = [
        9985.29, 9521.7, 10609.85, 10722.44, 11088.73, 11040.78, 10769.13, 9836.28, 9748.68, 10692.76,
        11106.9, 11477.61, 11367.07, 10921.37, 9892.04, 9730.07, 10540.26, 11047.02, 11579.19, 11121.86,
        10579.89, 9616.22, 9431.63, 10173.91, 10353.77, 10372.18, 10433.04, 10108.24, 8982.05, 8907.47
    ]

    july_data = [
        10125.33, 10414.75, 10171.08, 8868.59, 9608.99, 8923.4, 8846.87, 1856.47, 1311.32, 9300.11,
        10386.06, 9720.78, 9031.83, 9058.24, 10225.96, 10276.91, 10683.81, 10844.33, 10395.79, 9062.87,
        8833.78, 10069.03, 10537.97, 10665.36, 10967.56, 10521.47, 9196.81, 9144.67, 9997.58, 10688.94,
        11317.71
    ]

    # Calculate statistics
    def calculate_stats(data):
        avg_usage = np.mean(data)
        total_cost = np.sum(data)  # Assuming cost is equivalent to usage for simplicity
        max_usage = np.max(data)
        min_usage = np.min(data)
        avg_daily_usage = np.mean(data)
        return avg_usage, total_cost, max_usage, min_usage, avg_daily_usage

    june_stats = calculate_stats(june_data)
    july_stats = calculate_stats(july_data)
    total_savings = june_stats[1] - july_stats[1]

    stats = {
        'june': {
            'average_usage': june_stats[0],
            'total_cost': june_stats[1],
            'max_usage': june_stats[2],
            'min_usage': june_stats[3],
            'avg_daily_usage': june_stats[4]
        },
        'july': {
            'average_usage': july_stats[0],
            'total_cost': july_stats[1],
            'max_usage': july_stats[2],
            'min_usage': july_stats[3],
            'avg_daily_usage': july_stats[4]
        },
        'total_savings': total_savings
    }

    return jsonify(stats)

@app.route('/upload_june', methods=['POST'])
def upload_june_csv():
    global june_data
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read the CSV file
        df = pd.read_csv(file)
        
        # Extract the consumption data from the CSV (assuming structure is similar)
        consumption_data = df.iloc[0, 2:].values  # Adjust this based on your actual CSV structure

        june_data = consumption_data
        return jsonify({
            "message": "June data successfully uploaded",
            "data": consumption_data.tolist(),
        })
    
    except Exception as e:
        return jsonify({"error": f"Error processing June file: {str(e)}"}), 500


@app.route('/upload_july', methods=['POST'])
def upload_july_csv():
    global july_data
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read the CSV file
        df = pd.read_csv(file)
        
        # Extract the consumption data from the CSV (assuming structure is similar)
        consumption_data = df.iloc[0, 2:].values  # Adjust this based on your actual CSV structure

        july_data = consumption_data
        return jsonify({
            "message": "July data successfully uploaded",
            "data": consumption_data.tolist(),
        })
    
    except Exception as e:
        return jsonify({"error": f"Error processing July file: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)