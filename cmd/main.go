package main

import (
	"finance/database"
	"fmt"

	"finance/internal/handlers"
	"net/http"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func setupRoutes(mux *http.ServeMux) {

	// app.Use(cors.New(cors.Config{
	// 	AllowCredentials: true,
	// 	AllowOrigins:     "http://localhost:3000",
	// 	AllowMethods:     "GET, POST, PUT, DELETE, PATCH, OPTIONS",
	// 	AllowHeaders:     "Origin, Content-Type, Accept",
	// }))

	mux.HandleFunc("/api/register", handlers.HandleRegister)
	// app.Post("/api/login", handlers.HandleLogin)
	// app.Get("/api/user/:id", handlers.HandleGetUser)
	// app.Get("/api/currentUser", handlers.HandleGetCurrentUser)
	// app.Post("/api/createTransaction", handlers.HandleCreateTransaction)
	// app.Post("/api/createExpense", handlers.HandleCreateExpense)
	// app.Get("/api/allTransactions", handlers.HandleGetAllTransactions)
	// app.Get("/api/allExpenses", handlers.HandleGetAllExpenses)
	// app.Post("/api/createBudget", handlers.HandleCreateBudget)
	// app.Get("/api/allBudgets", handlers.HandleGetAllBudgets)
	// app.Delete("/api/deleteTransaction/:id", handlers.HandleDeleteTransaction)
	// app.Listen(":3001")

}

func main() {

	database.ConnectDB()
	mux := http.NewServeMux()

	// app := fiber.New()
	// protected := app.Group("/protected", middleware.CheckAuth)

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("test"))
	})
	mux.HandleFunc("POST /api/register", handlers.HandleRegister)
	mux.HandleFunc("POST /test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "testing post")
	})
	mux.HandleFunc("POST /api/login", handlers.HandleLogin)
	handler := corsMiddleware(mux)

	// setupRoutes(mux)
	fmt.Println("Starting server on :8080")
	http.ListenAndServe(":8080", handler)

}
