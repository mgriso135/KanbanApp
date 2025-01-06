package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func setRoutes(router *gin.Engine) {
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "hello"})
	})

	// Clienti
	router.GET("/api/clienti", getClienti)
	router.POST("/api/clienti", createCliente)
	router.PUT("/api/clienti/:id", modificaCliente)

	// Fornitori
	router.GET("/api/fornitori", getFornitori)
	router.POST("/api/fornitori", createFornitore)
	router.PUT("/api/fornitori/:id", modificaFornitore)

	// Prodotti
	router.GET("/api/prodotti", getProdotti)
	router.POST("/api/prodotti", createProdotto)

	//Kanban
	router.GET("/api/kanban", getKanbans)
	router.POST("/api/kanban", createKanban)
	router.PUT("/api/kanban/:id", modificaKanban)
	router.DELETE("/api/kanban/:id", eliminaKanban)
	//Kanban Stato
	router.PUT("/api/kanban/:id/stato", aggiornaStatoKanban)
	// Kanban History
	router.GET("/api/kanban/history", getKanbanHistory)

	// Dashboard Clienti
	router.GET("/api/dashboard/clienti/:id", getKanbanCliente)

	//Dashboard Fornitori
	router.GET("/api/dashboard/fornitori/:id", getKanbanFornitore)
}

// Handler per Clienti
func getClienti(c *gin.Context) {
	var clienti []Cliente
	db.Find(&clienti)
	c.JSON(http.StatusOK, clienti)
}
func createCliente(c *gin.Context) {
	var nuovoCliente Cliente
	if err := c.ShouldBindJSON(&nuovoCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&nuovoCliente)
	c.JSON(http.StatusCreated, gin.H{"message": "Cliente creato con successo!", "id": nuovoCliente.ID})
}
func modificaCliente(c *gin.Context) {
	id := c.Param("id")
	var cliente Cliente
	if err := db.Where("id = ?", id).First(&cliente).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente non trovato"})
		return
	}
	var updateCliente Cliente
	if err := c.ShouldBindJSON(&updateCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cliente.RagioneSociale = updateCliente.RagioneSociale
	cliente.Indirizzo = updateCliente.Indirizzo
	cliente.PartitaIva = updateCliente.PartitaIva
	cliente.CodiceSdi = updateCliente.CodiceSdi

	db.Save(&cliente)
	c.JSON(http.StatusOK, gin.H{"message": "Cliente modificato con successo!"})

}

// Handler per Fornitori
func getFornitori(c *gin.Context) {
	var fornitori []Fornitore
	db.Find(&fornitori)
	c.JSON(http.StatusOK, fornitori)
}
func createFornitore(c *gin.Context) {
	var nuovoFornitore Fornitore
	if err := c.ShouldBindJSON(&nuovoFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&nuovoFornitore)
	c.JSON(http.StatusCreated, gin.H{"message": "Fornitore creato con successo!", "id": nuovoFornitore.ID})
}
func modificaFornitore(c *gin.Context) {
	id := c.Param("id")
	var fornitore Fornitore
	if err := db.Where("id = ?", id).First(&fornitore).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fornitore non trovato"})
		return
	}
	var updateFornitore Fornitore
	if err := c.ShouldBindJSON(&updateFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fornitore.RagioneSociale = updateFornitore.RagioneSociale
	fornitore.Indirizzo = updateFornitore.Indirizzo
	fornitore.PartitaIva = updateFornitore.PartitaIva
	fornitore.CodiceSdi = updateFornitore.CodiceSdi
	db.Save(&fornitore)
	c.JSON(http.StatusOK, gin.H{"message": "Fornitore modificato con successo!"})
}

// Handler per Prodotti
func getProdotti(c *gin.Context) {
	var prodotti []Prodotto
	db.Find(&prodotti)
	c.JSON(http.StatusOK, prodotti)
}
func createProdotto(c *gin.Context) {
	var nuovoProdotto Prodotto
	if err := c.ShouldBindJSON(&nuovoProdotto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&nuovoProdotto)
	c.JSON(http.StatusCreated, gin.H{"message": "Prodotto creato con successo!", "codice_prodotto": nuovoProdotto.CodiceProdotto})
}

// Handler per Kanban
func getKanbans(c *gin.Context) {
	var kanbanList []Kanban
	db.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func createKanban(c *gin.Context) {
	var nuovoKanban Kanban
	if err := c.ShouldBindJSON(&nuovoKanban); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&nuovoKanban)
	c.JSON(http.StatusCreated, gin.H{"message": "Kanban creato con successo!", "id": nuovoKanban.ID})
}
func modificaKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban Kanban
	if err := db.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
	var updateKanban Kanban
	if err := c.ShouldBindJSON(&updateKanban); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	kanban.ClienteID = updateKanban.ClienteID
	kanban.ProdottoCodice = updateKanban.ProdottoCodice
	kanban.FornitoreID = updateKanban.FornitoreID
	kanban.Quantita = updateKanban.Quantita
	kanban.TipoContenitore = updateKanban.TipoContenitore
	kanban.LeadTime = updateKanban.LeadTime

	db.Save(&kanban)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban modificato con successo!"})
}
func eliminaKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban Kanban
	if err := db.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
	db.Delete(&kanban)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban eliminato con successo!"})
}

func aggiornaStatoKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban Kanban
	if err := db.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato"})
		return
	}
	var payload struct {
		Stato string `json:"stato"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	kanban.Stato = payload.Stato
	kanban.DataAggiornamento = time.Now()
	db.Save(&kanban)

	db.Create(&KanbanHistory{
		KanbanID: int(kanban.ID),
		Stato:    kanban.Stato,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Stato Kanban aggiornato con successo!"})
}

func getKanbanCliente(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []Kanban
	db.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Where("cliente_id = ?", id).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanFornitore(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []Kanban
	db.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Where("fornitore_id = ?", id).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanHistory(c *gin.Context) {
	var historyList []KanbanHistory
	db.Preload("Kanban").Preload("Kanban.Prodotto").Preload("Kanban.Cliente").Preload("Kanban.Fornitore").Find(&historyList)
	c.JSON(http.StatusOK, historyList)
}
