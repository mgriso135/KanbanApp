from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'kanban.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Modelli del Database
class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ragione_sociale = db.Column(db.String(100), nullable=False)
    indirizzo = db.Column(db.String(200), nullable=False)
    partita_iva = db.Column(db.String(20), nullable=False, unique=True)
    codice_sdi = db.Column(db.String(7), nullable=False)

class Fornitore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ragione_sociale = db.Column(db.String(100), nullable=False)
    indirizzo = db.Column(db.String(200), nullable=False)
    partita_iva = db.Column(db.String(20), nullable=False, unique=True)
    codice_sdi = db.Column(db.String(7), nullable=False)

class Prodotto(db.Model):
    codice_prodotto = db.Column(db.String(50), primary_key=True)
    descrizione = db.Column(db.String(200), nullable=False)
   
class Kanban(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)
    prodotto_codice = db.Column(db.String(50), db.ForeignKey('prodotto.codice_prodotto'), nullable=False)
    fornitore_id = db.Column(db.Integer, db.ForeignKey('fornitore.id'), nullable=False)
    quantita = db.Column(db.Integer, nullable=False)
    tipo_contenitore = db.Column(db.String(50), nullable=False)
    stato = db.Column(db.String(20), nullable=False, default='Attivo')
    data_aggiornamento = db.Column(db.DateTime, default=datetime.utcnow)
    lead_time = db.Column(db.Integer, nullable = False, default = 0)

    cliente = db.relationship('Cliente', backref=db.backref('kanbans', lazy=True))
    prodotto = db.relationship('Prodotto', backref=db.backref('kanbans', lazy=True))
    fornitore = db.relationship('Fornitore', backref=db.backref('kanbans', lazy=True))

class KanbanHistory(db.Model):
     id = db.Column(db.Integer, primary_key=True)
     kanban_id = db.Column(db.Integer, db.ForeignKey('kanban.id'), nullable=False)
     stato = db.Column(db.String(20), nullable=False)
     data_aggiornamento = db.Column(db.DateTime, default=datetime.utcnow)

     kanban = db.relationship('Kanban', backref=db.backref('history', lazy=True))


# Creazione delle tabelle nel database (solo la prima volta)
#with app.app_context():
#    db.create_all()

# API per Clienti
@app.route('/api/clienti', methods=['GET', 'POST'])
def gestisci_clienti():
    if request.method == 'GET':
        clienti_list = Cliente.query.all()
        return jsonify([{'id': c.id, 'ragione_sociale': c.ragione_sociale, 'indirizzo': c.indirizzo, 'partita_iva': c.partita_iva, 'codice_sdi': c.codice_sdi} for c in clienti_list])
    elif request.method == 'POST':
        data = request.get_json()
        nuovo_cliente = Cliente(ragione_sociale=data['ragione_sociale'], indirizzo=data['indirizzo'], partita_iva=data['partita_iva'], codice_sdi=data['codice_sdi'])
        db.session.add(nuovo_cliente)
        db.session.commit()
        return jsonify({'message': 'Cliente creato con successo!', 'id': nuovo_cliente.id}), 201
@app.route('/api/clienti/<int:cliente_id>', methods=['PUT'])
def modifica_cliente(cliente_id):
    data = request.get_json()
    try:
        cliente = Cliente.query.get(cliente_id)
        if cliente:
            cliente.ragione_sociale = data['ragione_sociale']
            cliente.indirizzo = data['indirizzo']
            cliente.partita_iva = data['partita_iva']
            cliente.codice_sdi = data['codice_sdi']
            db.session.commit()
            return jsonify({'message': 'Cliente modificato con successo!'}), 200
        return jsonify({'message': 'Cliente non trovato'}), 404
    except Exception as e:
        print(f"Errore nella modifica del cliente {e}")
        return jsonify({'message': 'Errore interno del server'}), 500


# API per Fornitori
@app.route('/api/fornitori', methods=['GET', 'POST'])
def gestisci_fornitori():
    if request.method == 'GET':
        fornitori_list = Fornitore.query.all()
        return jsonify([{'id': f.id, 'ragione_sociale': f.ragione_sociale, 'indirizzo': f.indirizzo, 'partita_iva': f.partita_iva, 'codice_sdi': f.codice_sdi} for f in fornitori_list])
    elif request.method == 'POST':
        data = request.get_json()
        nuovo_fornitore = Fornitore(ragione_sociale=data['ragione_sociale'], indirizzo=data['indirizzo'], partita_iva=data['partita_iva'], codice_sdi=data['codice_sdi'])
        db.session.add(nuovo_fornitore)
        db.session.commit()
        return jsonify({'message': 'Fornitore creato con successo!', 'id': nuovo_fornitore.id}), 201
@app.route('/api/fornitori/<int:fornitore_id>', methods=['PUT'])
def modifica_fornitore(fornitore_id):
     data = request.get_json()
     try:
        fornitore = Fornitore.query.get(fornitore_id)
        if fornitore:
            fornitore.ragione_sociale = data['ragione_sociale']
            fornitore.indirizzo = data['indirizzo']
            fornitore.partita_iva = data['partita_iva']
            fornitore.codice_sdi = data['codice_sdi']
            db.session.commit()
            return jsonify({'message': 'Fornitore modificato con successo!'}), 200
        return jsonify({'message': 'Fornitore non trovato'}), 404
     except Exception as e:
         print(f"Errore nella modifica del fornitore {e}")
         return jsonify({'message': 'Errore interno del server'}), 500

# API per Prodotti
@app.route('/api/prodotti', methods=['GET', 'POST'])
def gestisci_prodotti():
    if request.method == 'GET':
        prodotti_list = Prodotto.query.all()
        return jsonify([{'codice_prodotto': p.codice_prodotto, 'descrizione': p.descrizione} for p in prodotti_list])
    elif request.method == 'POST':
        data = request.get_json()
        nuovo_prodotto = Prodotto(codice_prodotto=data['codice_prodotto'], descrizione=data['descrizione'])
        db.session.add(nuovo_prodotto)
        db.session.commit()
        return jsonify({'message': 'Prodotto creato con successo!', 'codice_prodotto': nuovo_prodotto.codice_prodotto}), 201

# API per Kanban
@app.route('/api/kanban', methods=['GET', 'POST'])
def gestisci_kanban():
    if request.method == 'GET':
        kanban_list = Kanban.query.all()
        return jsonify([{'id': k.id, 'cliente_id': k.cliente_id, 'prodotto_codice': k.prodotto_codice,
                         'fornitore_id': k.fornitore_id, 'quantita': k.quantita, 'tipo_contenitore': k.tipo_contenitore,
                         'stato': k.stato, 'data_aggiornamento': k.data_aggiornamento.isoformat(),
                         'lead_time': k.lead_time,
                         'cliente': {'ragione_sociale': k.cliente.ragione_sociale} if k.cliente else None,
                         'prodotto': {'descrizione': k.prodotto.descrizione} if k.prodotto else None,
                         'fornitore': {'ragione_sociale': k.fornitore.ragione_sociale} if k.fornitore else None
                        } for k in kanban_list])
    elif request.method == 'POST':
        data = request.get_json()
        num_cartellini = int(data.get('num_cartellini', 1))
        created_kanbans = []
        for _ in range(num_cartellini):
          nuovo_kanban = Kanban(cliente_id=data['cliente_id'], prodotto_codice=data['prodotto_codice'],
                              fornitore_id=data['fornitore_id'], quantita=data['quantita'],
                              tipo_contenitore=data['tipo_contenitore'], lead_time = int(data['lead_time']))
          db.session.add(nuovo_kanban)
          db.session.flush()
          created_kanbans.append({'id': nuovo_kanban.id})

        db.session.commit()
        return jsonify({'message': f'{num_cartellini} Kanban creati con successo', 'ids': created_kanbans}), 201
@app.route('/api/kanban/<int:kanban_id>', methods=['PUT','DELETE'])
def modifica_kanban(kanban_id):
    if request.method == 'PUT':
      data = request.get_json()
      try:
          kanban = Kanban.query.get(kanban_id)
          if kanban:
             if data:
               kanban.cliente_id = data['cliente_id']
               kanban.prodotto_codice = data['prodotto_codice']
               kanban.fornitore_id = data['fornitore_id']
               kanban.quantita = data['quantita']
               kanban.tipo_contenitore = data['tipo_contenitore']
               kanban.lead_time = int(data['lead_time'])
               db.session.commit()
               return jsonify({'message': 'Kanban modificato con successo!'}), 200
             else:
               return jsonify({'message': 'Kanban modificato con successo! ma data null'}), 200
          return jsonify({'message': 'Kanban non trovato'}), 404
      except Exception as e:
          print(f"Errore nella modifica del kanban {e}")
          return jsonify({'message': 'Errore interno del server'}), 500
    elif request.method == 'DELETE':
        try:
             kanban = Kanban.query.get(kanban_id)
             if kanban:
                db.session.delete(kanban)
                db.session.commit()
                return jsonify({'message': 'Kanban eliminato con successo!'}), 200
             return jsonify({'message': 'Kanban non trovato'}), 404
        except Exception as e:
          print(f"Errore nell'eliminazione del kanban {e}")
          return jsonify({'message': 'Errore interno del server'}), 500

# API per aggiornare lo stato del kanban
@app.route('/api/kanban/<int:kanban_id>/stato', methods=['PUT'])
def aggiorna_stato_kanban(kanban_id):
    data = request.get_json()
    try:
        kanban_card = Kanban.query.get(kanban_id)
        if kanban_card:
             if data:
               kanban_card.stato = data['stato']
               kanban_card.data_aggiornamento = datetime.utcnow()
               history_entry = KanbanHistory(kanban_id = kanban_card.id, stato = kanban_card.stato)
               db.session.add(history_entry)
               db.session.commit()
               return jsonify({'message': 'Stato kanban aggiornato con successo'}), 200
             else:
              return jsonify({'message': 'Stato kanban aggiornato con successo, ma data null'}), 200
        return jsonify({'message': 'Kanban non trovato'}), 404
    except Exception as e:
        print(f"Errore durante la modifica dello stato del kanban {e}")
        return jsonify({'message': 'Errore interno del server'}), 500


# API per dashboard clienti
@app.route('/api/dashboard/clienti/<int:cliente_id>', methods=['GET'])
def get_kanban_cliente(cliente_id):
  kanban_list = Kanban.query.filter_by(cliente_id=cliente_id).all()
  return jsonify([{'id': k.id, 'cliente_id': k.cliente_id, 'prodotto_codice': k.prodotto_codice,
                   'fornitore_id': k.fornitore_id, 'quantita': k.quantita,
                   'tipo_contenitore': k.tipo_contenitore, 'stato': k.stato,
                   'data_aggiornamento': k.data_aggiornamento.isoformat(),
                   'lead_time': k.lead_time,
                   'cliente': {'ragione_sociale': k.cliente.ragione_sociale} if k.cliente else None,
                   'prodotto': {'descrizione': k.prodotto.descrizione} if k.prodotto else None
                   } for k in kanban_list])


# API per dashboard fornitori
@app.route('/api/dashboard/fornitori/<int:fornitore_id>', methods=['GET'])
def get_kanban_fornitore(fornitore_id):
  kanban_list = Kanban.query.filter_by(fornitore_id=fornitore_id).all()
  return jsonify([{'id': k.id, 'cliente_id': k.cliente_id, 'prodotto_codice': k.prodotto_codice,
                   'fornitore_id': k.fornitore_id, 'quantita': k.quantita,
                   'tipo_contenitore': k.tipo_contenitore, 'stato': k.stato,
                   'data_aggiornamento': k.data_aggiornamento.isoformat(),
                    'lead_time': k.lead_time,
                    'cliente': {'ragione_sociale': k.cliente.ragione_sociale} if k.cliente else None,
                   'prodotto': {'descrizione': k.prodotto.descrizione} if k.prodotto else None,
                   } for k in kanban_list])

# API per Kanban History
@app.route('/api/kanban/history', methods=['GET'])
def gestisci_kanban_history():
    history_list = KanbanHistory.query.all()
    history = []
    for entry in history_list:
      history.append(
          {
            'id': entry.id,
            'kanban_id': entry.kanban_id,
            'stato': entry.stato,
            'data_aggiornamento': entry.data_aggiornamento.isoformat(),
            'kanban':{'prodotto': {'descrizione': entry.kanban.prodotto.descrizione} if entry.kanban and entry.kanban.prodotto else None,
                      'cliente': {'ragione_sociale': entry.kanban.cliente.ragione_sociale} if entry.kanban and entry.kanban.cliente else None,
                      'fornitore': {'ragione_sociale': entry.kanban.fornitore.ragione_sociale} if entry.kanban and entry.kanban.fornitore else None,
                      'quantita': entry.kanban.quantita if entry.kanban else None,
                      'tipo_contenitore': entry.kanban.tipo_contenitore if entry.kanban else None,
                      'lead_time': entry.kanban.lead_time if entry.kanban else None
                      }
          }
      )
    return jsonify(history)

if __name__ == '__main__':
    app.run(debug=True)