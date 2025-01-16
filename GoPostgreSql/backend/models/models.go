package models

import (
	"time"

	"gorm.io/gorm"
)

// Cliente represents a customer in the application.
type Cliente struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo      string `gorm:"not null" json:"indirizzo"`
	PartitaIva     string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi      string `gorm:"not null" json:"codice_sdi"`
}

// Fornitore represents a supplier in the application.
type Fornitore struct {
	ID             uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	RagioneSociale string `gorm:"not null" json:"ragione_sociale"`
	Indirizzo      string `gorm:"not null" json:"indirizzo"`
	PartitaIva     string `gorm:"not null;unique" json:"partita_iva"`
	CodiceSdi      string `gorm:"not null" json:"codice_sdi"`
}

// Prodotto represents a product in the application.
type Prodotto struct {
	CodiceProdotto string `gorm:"primaryKey;not null" json:"codice_prodotto"`
	Descrizione    string `gorm:"not null" json:"descrizione"`
}

// KanbanStatusChain represents a chain of kanban statuses.
type KanbanStatusChain struct {
	ID   uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"not null" json:"name"`
}

// KanbanChain represents the status chain of a Kanban
type KanbanChain struct {
	ID                  uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	ClienteID           uint   `gorm:"not null" json:"cliente_id"`
	ProdottoCodice      string `gorm:"not null" json:"prodotto_codice"`
	FornitoreID         uint   `gorm:"not null" json:"fornitore_id"`
	Name                string `gorm:"not null" json:"name"`
	LeadTime            int    `gorm:"not null;default:0" json:"lead_time"`
	Quantita            uint   `gorm:"not null;default:1" json:"quantita"`
	TipoContenitore     string `gorm:"not null;default:'Box'" json:"tipo_contenitore"`
	KanbanStatusChainID uint   `gorm:"not null" json:"kanban_statuschain_id"`

	Cliente           Cliente           `gorm:"foreignKey:ClienteID" json:"cliente"`
	Prodotto          Prodotto          `gorm:"foreignKey:ProdottoCodice" json:"prodotto"`
	Fornitore         Fornitore         `gorm:"foreignKey:FornitoreID" json:"fornitore"`
	KanbanStatuses    []*KanbanStatus   `gorm:"many2many:kanban_chain_statuses;constraint:OnDelete:CASCADE;foreignKey:ID;joinForeignKey:KanbanChainID;AssociationForeignKey:ID;joinAssociationForeignKey:KanbanStatusID" json:"kanban_statuses"`
	KanbanStatusChain KanbanStatusChain `gorm:"foreignKey:KanbanStatusChainID" json:"kanban_status_chain"`
}

type KanbanChainStatus struct {
	KanbanChainID  uint         `gorm:"primaryKey" json:"kanban_chain_id"`
	KanbanStatusID uint         `gorm:"primaryKey" json:"kanban_status_id"`
	Order          int          `gorm:"not null" json:"order"`
	Name           string       `gorm:"not null;default:''" json:"name"`
	KanbanStatus   KanbanStatus `gorm:"foreignKey:KanbanStatusID" json:"kanban_status"`
}

// KanbanStatus represents a single status in the kanban chain.
type KanbanStatus struct {
	ID    uint   `gorm:"primaryKey;autoIncrement" json:"id"`
	Name  string `gorm:"not null" json:"name"`
	Color string `gorm:"not null;default:'#ffffff'" json:"color"`
}

// Kanban represents a kanban card in the application.
type Kanban struct {
	ID                uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Stato             string    `gorm:"not null;default:'Attivo'" json:"stato"`
	DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
	IsActive          bool      `gorm:"not null;default:true" json:"is_active"`
	KanbanChainID     uint      `gorm:"not null" json:"kanban_chain_id"`

	KanbanChain KanbanChain `gorm:"foreignKey:KanbanChainID" json:"kanban_chain"`
}

// KanbanHistory represents a single state change in the kanban
type KanbanHistory struct {
	ID                uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	KanbanID          uint      `gorm:"not null" json:"kanban_id"`
	Stato             string    `gorm:"not null" json:"stato"`
	DataAggiornamento time.Time `gorm:"not null;autoCreateTime" json:"data_aggiornamento"`
	Kanban            Kanban    `gorm:"foreignKey:KanbanID" json:"kanban"`
}

func (k *Kanban) GetKanbanHistoryRecords(db *gorm.DB) ([]KanbanHistory, error) {
	var history []KanbanHistory
	if err := db.Preload("Kanban").Where("kanban_id = ?", k.ID).Find(&history).Error; err != nil {
		return nil, err
	}
	return history, nil
}
