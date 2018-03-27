// include the library code:
#include <LiquidCrystal.h>

#define XAXIS A0 
#define YAXIS A2 
#define THICKNESS A1 
#define COLOR_A 7 
#define COLOR_B 6 
#define CLEAR 8 

int COLOR_POS= 0;
int COLOR_A_LAST = LOW;
int n = LOW;

int newX = 0;
int oldX = 0;
int newY = 0;
int oldY = 0;
int newT = 0;
int oldT = 0;

//LCD PINS
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

void setup(){
  pinMode(CLEAR, INPUT);
  pinMode (COLOR_B, INPUT_PULLUP);
  pinMode (COLOR_A, INPUT_PULLUP);
  lcd.begin(16,2);
  Serial.begin (9600);
}

void loop()
{
  static unsigned int counter4x = 0;      //the SparkFun encoders jump by 4 states from detent to detent
  static unsigned int counter = 0;
  static unsigned int prevCounter = 0;
  int tmpdata;
  tmpdata = read_encoder();
  if (tmpdata) {
    counter4x += tmpdata;
    counter = counter4x/4;
    counter = counter % 10;
    if (prevCounter != counter){
      Serial.print("c");
      Serial.println(counter);
    }
    prevCounter = counter;
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Color");
    lcd.setCursor(0,1);
    
    switch (counter) {
      case 0: 
        lcd.print("Red");
        break;
      case 1: 
        lcd.print("Orange");
        break;
      case 2: 
        lcd.print("Yellow");
        break;
      case 3: 
        lcd.print("Light Green");
        break;
      case 4: 
        lcd.print("Green");
        break;
      case 5: 
        lcd.print("Teal");
        break;
      case 6: 
        lcd.print("Blue");
        break;
      case 7: 
        lcd.print("Purple");
        break;
      case 8: 
        lcd.print("Pink");
        break;
      case 9: 
        lcd.print("Black");
        break;
    }
  }

  if (digitalRead(CLEAR) == LOW) {
    Serial.println('d');
    lcd.clear();
    lcd.print("Cleared Image");
  }

  newX = analogRead(XAXIS);
  if (oldX >= newX + 10 || oldX <= newX - 10) {
    Serial.print('x');
    Serial.println(newX);
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("X-Axis");
   
    if(oldX > newX) {
      lcd.setCursor(0,1);
      lcd.print("---");   
    } else {
      lcd.setCursor(0,1);
      lcd.print("+++");   
    }
    
    oldX = newX;
  }

  newY = analogRead(YAXIS);
  if (oldY >= newY + 10 || oldY <= newY - 10) {
    Serial.print('y');
    Serial.println(newY);
    
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Y-Axis");
    
    if(oldY > newY) {
      lcd.setCursor(0,1);
      lcd.print("---");   
    } else {
      lcd.setCursor(0,1);
      lcd.print("+++");   
    }
    
    oldY = newY;
  }

  newT = analogRead(THICKNESS);
  if (oldT >= newT + 10 || oldT <= newT - 10) {
    Serial.print('t');
    Serial.println(map(newT, 0, 1023, 3, 20));
    
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Thickness");
    
    if(oldT > newT) {
      lcd.setCursor(0,1);
      lcd.print("---");   
    } else {
      lcd.setCursor(0,1);
      lcd.print("+++");   
    }
    oldT = newT;
  }
}
 
/* returns change in encoder state (-1,0,1) */
int read_encoder()
{
  static int enc_states[] = {
    0,-1,1,0,1,0,0,-1,-1,0,0,1,0,1,-1,0  };
  static byte ABab = 0;
  ABab *= 4;                   //shift the old values over 2 bits
  ABab = ABab%16;      //keeps only bits 0-3
  ABab += 2*digitalRead(COLOR_A)+digitalRead(COLOR_B); //adds enc_a and enc_b values to bits 1 and 0
  return ( enc_states[ABab]);
 
 
}
