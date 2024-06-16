package handlers

import (
	"encoding/json"
	"errors"
	"finance/database"
	"finance/models"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func hashPassword(data map[string]string, cost int) ([]byte, error) {
	if _, ok := data["password"]; !ok {
		return nil, errors.New("password key not found in map")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), cost)
	if err != nil {
		log.Println("Error", err)
	}

	return hashedPassword, nil
}

// when they log in

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	var data map[string]string

	// if err := c.Bind().Body(&data); err != nil {
	// 	return err
	// }

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	password, _ := hashPassword(data, 14)

	user := models.User{
		Name:     data["name"],
		Email:    data["email"],
		Username: data["username"],
		Password: password,
	}
	result := database.DB.Create(&user)
	// return c.JSON(user)
	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	// Return the created user as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
