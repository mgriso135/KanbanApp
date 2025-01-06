package routes

import (
	"kanban/controllers"
	"github.com/gin-gonic/gin"
)


func SetupRoutes(router *gin.Engine){
	router.GET("/api/clienti", controllers.GetClienti)
	router.POST("/api/clienti", controllers.CreateCliente)
    router.PUT("/api/clienti/:cliente_id", controllers.UpdateCliente)

	router.GET("/api/fornitori", controllers.GetFornitori)
	router.POST("/api/fornitori", controllers.CreateFornitore)
     router.PUT("/api/fornitori/:fornitore_id", controllers.UpdateFornitore)

    router.GET("/api/prodotti", controllers.GetProdotti)
	router.POST("/api/prodotti", controllers.CreateProdotto)

    router.GET("/api/kanban", controllers.GetKanban)
	router.POST("/api/kanban", controllers.CreateKanban)
     router.PUT("/api/kanban/:kanban_id", controllers.UpdateKanban)
      router.DELETE("/api/kanban/:kanban_id", controllers.DeleteKanban)

    router.PUT("/api/kanban/:kanban_id/stato", controllers.UpdateKanbanState)


    router.GET("/api/kanban/history", controllers.GetKanbanHistory)

    router.GET("/api/dashboard/clienti/:cliente_id", controllers.GetKanbanCliente)
    router.GET("/api/dashboard/fornitori/:fornitore_id", controllers.GetKanbanFornitore)
}