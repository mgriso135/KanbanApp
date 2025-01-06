package main

import "time"

// Cliente represents a customer in the application.
type Cliente struct {
	ID           int    `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo     string `gorm:"not null" json:"indirizzo"`
	PartitaIva    string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi     string `gorm:"not null" json:"codice_sdi"`
}

// Fornitore represents a supplier in the application.
type Fornitore struct {
	ID           int    `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo     string `gorm:"not null" json:"indirizzo"`
	PartitaIva    string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi     string `gorm:"not null" json:"codice_sdi"`
}

// Prodotto represents a product in the application.
type Prodotto struct {
	CodiceProdotto string `gorm:"primaryKey;not null" json:"codice_prodotto"`
    Descrizione  string `gorm:"not null" json:"descrizione"`
}

// Kanban represents a kanban card in the application.
type Kanban struct {
	ID             int    `gorm:"primaryKey;autoIncrement" json:"id"`
	ClienteID     int    `gorm:"not null" json:"cliente_id"`
	ProdottoCodice string `gorm:"not null" json:"prodotto_codice"`
	FornitoreID   int    `gorm:"not null" json:"fornitore_id"`
	Quantita       int    `gorm:"not null" json:"quantita"`
	TipoContenitore string `gorm:"not null" json:"tipo_contenitore"`
	Stato         string `gorm:"not null;default:'Attivo'" json:"stato"`
	DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
	LeadTime int  `gorm:"not null;default:0" json:"lead_time"`

    Cliente   Cliente `gorm:"foreignKey:ClienteID" json:"cliente"`
    Prodotto  Prodotto  `gorm:"foreignKey:ProdottoCodice" json:"prodotto"`
    Fornitore Fornitore `gorm:"foreignKey:FornitoreID" json:"fornitore"`

}

// KanbanHistory represents a single state change in the kanban
type KanbanHistory struct {
    ID        int        `gorm:"primaryKey;autoIncrement" json:"id"`
    KanbanID int        `gorm:"not null" json:"kanban_id"`
    Stato    string     `gorm:"not null" json:"stato"`
    DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
    Kanban Kanban `gorm:"foreignKey:KanbanID" json:"kanban"`
}