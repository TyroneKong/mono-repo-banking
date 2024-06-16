package models

import "time"

type AccountBalance struct {
	UserID     string    `gorm:"not null" json:"user_id"`
	Name       string    `gorm:"not null" json:"name"`
	Amount     float64   `gorm:"not null" json:"withdrawl_amount"`
	Currency   string    `gorm:"not null" json:"currency"`
	Balance    float64   `gorm:"not null" json:"balance"`
	CreateDate time.Time `gorm:"autoCreateTime" json:"createdate"`
}
