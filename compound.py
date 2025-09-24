import datetime
import decimal

def calculate_compounded_investment(start_amount, days):
    """
    Calculates the compounded investment with a 1% increase, rounded to the nearest tenth,
    3 times a day.
    """
    current_investment = decimal.Decimal(str(start_amount))
    increase_rate = decimal.Decimal('0.01')
    decimal.getcontext().prec = 28
    decimal.getcontext().rounding = decimal.ROUND_HALF_UP
    compounds_per_day = 3

    for _ in range(days):
        for _ in range(compounds_per_day):
            increase = current_investment * increase_rate
            rounded_increase = increase.quantize(decimal.Decimal('0.1'))
            current_investment += rounded_increase
            
    return current_investment


def days_to_reach_target(start_amount, target_amount):
    """
    Calculates the number of days needed to reach or exceed a target amount
    with 1% increase, rounded to nearest tenth, compounded 3 times per day.
    """
    current_investment = decimal.Decimal(str(start_amount))
    target = decimal.Decimal(str(target_amount))
    increase_rate = decimal.Decimal('0.01')
    decimal.getcontext().prec = 28
    decimal.getcontext().rounding = decimal.ROUND_HALF_UP
    compounds_per_day = 3
    
    days = 0
    while current_investment < target:
        days += 1
        for _ in range(compounds_per_day):
            increase = current_investment * increase_rate
            rounded_increase = increase.quantize(decimal.Decimal('0.1'))
            current_investment += rounded_increase

    return days


# --- Usage Example ---

# First calculation (from your code)
start_date = datetime.date(2025, 9, 24)
end_date = datetime.date(2025, 12, 31)
delta = end_date - start_date
days_period = delta.days

A1 = 14.38
final_investment = calculate_compounded_investment(A1, days_period)

print(f"Start Date: {start_date}")
print(f"End Date: {end_date}")
print(f"Number of compounding days: {days_period}")
print(f"The final investment after {days_period} days is: ${final_investment:.2f}")

# New calculation: how many days to reach a target
target = 300
needed_days = days_to_reach_target(A1, target)
finish_date = start_date + datetime.timedelta(days=needed_days)
print(f"\nTo reach ${target}, it will take about {needed_days} days (until {finish_date}).")
