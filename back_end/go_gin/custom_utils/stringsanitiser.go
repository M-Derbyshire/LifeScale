package customutils

import "strings"

//Sanitises a string from any HTML tags, or other dangerous text (SQL injection has to be handled by the ORM)
func StringSanitiser(str string) string {

	//Sanitise HTML elements
	str = strings.ReplaceAll(str, "<", "&lt;")
	str = strings.ReplaceAll(str, ">", "&gt;")

	return str
}
