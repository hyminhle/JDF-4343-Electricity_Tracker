from flask import Flask, Response
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



@app.route('/line-graph')
def line_graph():
    # Generate the plot
    x = [1, 2, 3, 4, 5]
    y = [10, 20, 30, 40, 50]
    plt.figure()
    plt.plot(x, y)
    plt.title('Line Graph Example')
    plt.xlabel('X-axis')
    plt.ylabel('Y-axis')
    
    # Save the plot to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    # Return the image as a response
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)