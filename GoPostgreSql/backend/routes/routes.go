// routes/routes.go
package routes

import (
	"net/http"
	"time"
	"kanban/db"
    "kanban/models"

	"github.com/gin-gonic/gin"
)

func SetRoutes(router *gin.Engine) {
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
	var clienti []models.Cliente
	db.DB.Find(&clienti)
	c.JSON(http.StatusOK, clienti)
}
func createCliente(c *gin.Context) {
	var nuovoCliente models.Cliente
	if err := c.ShouldBindJSON(&nuovoCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoCliente)
	c.JSON(http.StatusCreated, gin.H{"message": "Cliente creato con successo!", "id": nuovoCliente.ID})
}
func modificaCliente(c *gin.Context) {
	id := c.Param("id")
	var cliente models.Cliente
	if err := db.DB.Where("id = ?", id).First(&cliente).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cliente non trovato", "details": err.Error()})
		return
	}
	var updateCliente models.Cliente
	if err := c.ShouldBindJSON(&updateCliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cliente.RagioneSociale = updateCliente.RagioneSociale
	cliente.Indirizzo = updateCliente.Indirizzo
	cliente.PartitaIva = updateCliente.PartitaIva
	cliente.CodiceSdi = updateCliente.CodiceSdi

	db.DB.Save(&cliente)
	c.JSON(http.StatusOK, gin.H{"message": "Cliente modificato con successo!"})

}

// Handler per Fornitori
func getFornitori(c *gin.Context) {
	var fornitori []models.Fornitore
	db.DB.Find(&fornitori)
	c.JSON(http.StatusOK, fornitori)
}
func createFornitore(c *gin.Context) {
	var nuovoFornitore models.Fornitore
	if err := c.ShouldBindJSON(&nuovoFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoFornitore)
	c.JSON(http.StatusCreated, gin.H{"message": "Fornitore creato con successo!", "id": nuovoFornitore.ID})
}
func modificaFornitore(c *gin.Context) {
	id := c.Param("id")
	var fornitore models.Fornitore
	if err := db.DB.Where("id = ?", id).First(&fornitore).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fornitore non trovato", "details": err.Error()})
		return
	}
	var updateFornitore models.Fornitore
	if err := c.ShouldBindJSON(&updateFornitore); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fornitore.RagioneSociale = updateFornitore.RagioneSociale
	fornitore.Indirizzo = updateFornitore.Indirizzo
	fornitore.PartitaIva = updateFornitore.PartitaIva
	fornitore.CodiceSdi = updateFornitore.CodiceSdi
	db.DB.Save(&fornitore)
	c.JSON(http.StatusOK, gin.H{"message": "Fornitore modificato con successo!"})
}

// Handler per Prodotti
func getProdotti(c *gin.Context) {
	var prodotti []models.Prodotto
	db.DB.Find(&prodotti)
	c.JSON(http.StatusOK, prodotti)
}
func createProdotto(c *gin.Context) {
	var nuovoProdotto models.Prodotto
	if err := c.ShouldBindJSON(&nuovoProdotto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&nuovoProdotto)
	c.JSON(http.StatusCreated, gin.H{"message": "Prodotto creato con successo!", "codice_prodotto": nuovoProdotto.CodiceProdotto})
}

// Handler per Kanban
func getKanbans(c *gin.Context) {
	var kanbanList []models.Kanban
	db.DB.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Where("is_active = ?", true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func createKanban(c *gin.Context) {
    var payload struct {
        ClienteID     uint   `json:"cliente_id"`
        ProdottoCodice string `json:"prodotto_codice"`
        FornitoreID   uint   `json:"fornitore_id"`
        Quantita       uint   `json:"quantita"`
        TipoContenitore string `json:"tipo_contenitore"`
        LeadTime int `json:"lead_time"`
         NumCartellini  int `json:"num_cartellini"`
    }
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    var createdKanbans []models.Kanban
     for i := 0; i < payload.NumCartellini; i++ {
        nuovoKanban := models.Kanban{
            ClienteID:         payload.ClienteID,
            ProdottoCodice:    payload.ProdottoCodice,
            FornitoreID:       payload.FornitoreID,
            Quantita:          payload.Quantita,
            TipoContenitore:  payload.TipoContenitore,
             LeadTime:         payload.LeadTime,
        }
         db.DB.Create(&nuovoKanban)
         createdKanbans = append(createdKanbans, nuovoKanban)
    }
    c.JSON(http.StatusCreated, gin.H{"message": "Kanban creato con successo!", "ids": createdKanbans})
}
func modificaKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban models.Kanban
	if err := db.DB.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
		return
	}
	var updateKanban models.Kanban
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

	db.DB.Save(&kanban)
	c.JSON(http.StatusOK, gin.H{"message": "Kanban modificato con successo!"})
}
func eliminaKanban(c *gin.Context) {
    id := c.Param("id")
    var kanban models.Kanban
    if err := db.DB.Where("id = ?", id).First(&kanban).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
        return
    }
    kanban.IsActive = false
    db.DB.Save(&kanban)
    c.JSON(http.StatusOK, gin.H{"message": "Kanban eliminato con successo!"})
}

func aggiornaStatoKanban(c *gin.Context) {
	id := c.Param("id")
	var kanban models.Kanban
	if err := db.DB.Where("id = ?", id).First(&kanban).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kanban non trovato", "details": err.Error()})
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
	db.DB.Model(&kanban).Updates(kanban)

	db.DB.Create(&models.KanbanHistory{
		KanbanID: uint(kanban.ID),
		Stato:    kanban.Stato,
	})

	c.JSON(http.StatusOK, gin.H{"message": "Stato Kanban aggiornato con successo!"})
}

func getKanbanCliente(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []models.Kanban
	db.DB.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Where("cliente_id = ? AND is_active = ?", id, true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanFornitore(c *gin.Context) {
	id := c.Param("id")
	var kanbanList []models.Kanban
	db.DB.Preload("Cliente").Preload("Fornitore").Preload("Prodotto").Where("fornitore_id = ? AND is_active = ?", id, true).Find(&kanbanList)
	c.JSON(http.StatusOK, kanbanList)
}

func getKanbanHistory(c *gin.Context) {
	var historyList []models.KanbanHistory
	db.DB.Preload("Kanban").Preload("Kanban.Prodotto").Preload("Kanban.Cliente").Preload("Kanban.Fornitore").Find(&historyList)
	c.JSON(http.StatusOK, historyList)
}