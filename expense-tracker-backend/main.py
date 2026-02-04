from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Expense
from schemas import ExpenseCreate, ExpenseResponse
import models
import requests
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@app.post("/expenses", response_model=ExpenseResponse)
def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = Expense(**expense.dict())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

# READ
@app.get("/expenses", response_model=list[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()

# UPDATE
@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, expense: ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    for key, value in expense.dict().items():
        setattr(db_expense, key, value)
    db.commit()
    return {"message": "Updated"}

# DELETE
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
    db.delete(db_expense)
    db.commit()
    return {"message": "Deleted"}

# DASHBOARD
@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    data = {}
    expenses = db.query(Expense).all()
    for e in expenses:
        data[e.category] = data.get(e.category, 0) + e.amount
    return data

# THIRD-PARTY API
@app.get("/convert")
def convert(amount: float):
    res = requests.get("https://api.exchangerate-api.com/v4/latest/USD").json()
    return {
        "USD": amount,
        "INR": amount * res["rates"]["INR"]
    }
