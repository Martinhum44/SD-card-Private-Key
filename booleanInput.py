class BooleanInput:
    def __init__(self, question, trueValue="y", falseValue="n"):
        while True:
            self.TV = trueValue
            self.FV = falseValue
            self.finalValue = input(question)
            if self.TV == self.finalValue or self.FV == self.finalValue: break
            else: print(f"Invalid choice. Please enter either ({self.TV}) or ({self.FV})")
    
    def __bool__(self):  
        return self.finalValue.lower() == self.TV.lower()
    
    def __str__(self):
        return self.finalValue
    
    def __repr__(self):
        return f"{self.finalValue} with boolean value {self.finalValue.lower() == self.TV.lower()}"