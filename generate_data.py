import csv
import random

occupations = ['Student', 'Homemaker', 'Working Professional', 'Entrepreneur']

with open('mock_savings_data.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['User_ID', 'Age', 'Occupation', 'Monthly_Income', 'Monthly_Expenses', 'Category_Needs', 'Category_Wants', 'Actual_Savings', 'Financial_Health_Score'])
    
    for i in range(1, 501):
        occ = random.choices(occupations, weights=[0.25, 0.25, 0.35, 0.15])[0]
        
        if occ == 'Student':
            age = random.randint(18, 23)
            income = random.randint(3000, 12000)
            savings_rate = random.uniform(0.05, 0.25)
        elif occ == 'Homemaker':
            age = random.randint(25, 55)
            income = random.randint(15000, 35000)
            savings_rate = random.uniform(0.15, 0.35)
        elif occ == 'Working Professional':
            age = random.randint(22, 50)
            income = random.randint(40000, 120000)
            savings_rate = random.uniform(0.20, 0.45)
        else: # Entrepreneur
            age = random.randint(25, 60)
            income = random.randint(60000, 200000)
            savings_rate = random.uniform(0.15, 0.40)
            
        savings = int(income * savings_rate)
        expenses = income - savings
        
        # Split expenses into Needs (~60%) and Wants (~40%) with some randomness
        needs_ratio = random.uniform(0.50, 0.70)
        needs = int(expenses * needs_ratio)
        wants = expenses - needs
        
        # Financial Health Score out of 100 based on savings rate
        score = int(savings_rate * 200 + random.randint(10, 20))
        score = min(max(score, 30), 98) # Keep it in range [30, 98]
        
        writer.writerow([i, age, occ, income, expenses, needs, wants, savings, score])

print("Successfully generated 500 rows of user financial records in 'mock_savings_data.csv'.")
