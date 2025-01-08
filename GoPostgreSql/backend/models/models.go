// models/models.go
package models

import "time"
 // Cliente represents a customer in the application.
 type Cliente struct {
    ID           uint    `gorm:"primaryKey;autoIncrement" json:"id"`
    RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
    Indirizzo     string `gorm:"not null" json:"indirizzo"`
    PartitaIva    string `gorm:"not null;unique" json:"partita_iva"`
    CodiceSdi     string `gorm:"not null" json:"codice_sdi"`
 }

 // Fornitore represents a supplier in the application.
 type Fornitore struct {
    ID           uint    `gorm:"primaryKey;autoIncrement" json:"id"`
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
    ID             uint    `gorm:"primaryKey;autoIncrement" json:"id"`
    ClienteID     uint    `gorm:"not null" json:"cliente_id"`
    ProdottoCodice string `gorm:"not null" json:"prodotto_codice"`
    FornitoreID   uint    `gorm:"not null" json:"fornitore_id"`
    Quantita       uint    `gorm:"not null" json:"quantita"`
    TipoContenitore string `gorm:"not null" json:"tipo_contenitore"`
    Stato         string `gorm:"not null;default:'Attivo'" json:"stato"`
    DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
    LeadTime int  `gorm:"not null;default:0" json:"lead_time"`
    IsActive      bool  `gorm:"not null;default:true" json:"is_active"`

    Cliente   Cliente `gorm:"foreignKey:ClienteID" json:"cliente"`
    Prodotto  Prodotto  `gorm:"foreignKey:ProdottoCodice" json:"prodotto"`
    Fornitore Fornitore `gorm:"foreignKey:FornitoreID" json:"fornitore"`

 }

 // KanbanHistory represents a single state change in the kanban
 type KanbanHistory struct {
     ID        uint        `gorm:"primaryKey;autoIncrement" json:"id"`
     KanbanID uint        `gorm:"not null" json:"kanban_id"`
     Stato    string     `gorm:"not null" json:"stato"`
     DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
     Kanban Kanban `gorm:"foreignKey:KanbanID" json:"kanban"`
 }