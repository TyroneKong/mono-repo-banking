package handlers

import (
	"encoding/json"
	"errors"
	"finance/database"
	"finance/models"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func compareHashedPassword(data map[string]string, user models.User) error {
	if _, ok := data["password"]; !ok {
		return errors.New("password key not found in map")
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		return fmt.Errorf("passwords do not match")
	}

	return nil
}

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	var data map[string]string

	// if err := c.Bind().Body(&data); err != nil {
	// 	return err
	// }

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	log.Println("data:", data)

	if err := compareHashedPassword(data, user); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)

	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
	})

	token, _ := claims.SignedString([]byte(os.Getenv("API_SECRET")))

	http.SetCookie(w, &http.Cookie{
		Name:    "jwt",
		Path:    "/",
		Value:   token,
		Expires: time.Now().Add(time.Hour * 48),
		// HTTPOnly: true,
	})

	log.Println("cookie", token)

	// c.Cookie(&cookie)

	// return c.JSON(fiber.Map{
	// 	"message": "success",
	// 	"user":    user,
	// })
	w.Header().Set("content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{})
}
