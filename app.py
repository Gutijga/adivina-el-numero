from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Variable global para el número secreto
numero_secreto = random.randint(1, 50)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/adivinar', methods=['POST'])
def adivinar():
    global numero_secreto
    adivinanza = int(request.json['numero'])
    intentos = int(request.json['intentos'])

    if adivinanza < numero_secreto:
        mensaje = "Tu adivinanza es demasiado baja. ¡Intenta de nuevo!"
        resultado = False
    elif adivinanza > numero_secreto:
        mensaje = "Tu adivinanza es demasiado alta. ¡Intenta de nuevo!"
        resultado = False
    else:
        mensaje = f" Adivinaste el número {numero_secreto} en {intentos} intentos."
        resultado = True
        numero_secreto = random.randint(1, 50)  # Reiniciar el número secreto

    return jsonify({"mensaje": mensaje, "resultado": resultado, "intentos": intentos})


if __name__ == '__main__':
    app.run(debug=True, port=5500)
