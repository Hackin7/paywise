let getCode = (total_spent, spending_amount, spend_type) => `
#Ex Credit
total_spent=${total_spent} # Amount spent so far in that month
spending_amount=${spending_amount} # Amount spent at a time
spend_type="${spend_type}" #online, fb, retail, travel

cardlist=[0, 0, 0, 0] # Points of card, [0] is a, [1] is b, [2] is c, [3] is d

Standard_Chartered_smart_credit_card ={
"name": "Standard Chartered smart credit card",
"minSpend": 0,
"maxSpend": 0,
"discFB": 0.06,
"discTravel": 0.06,
"discRetail": 0.06,
"discOnline": 0.06
}

HSBC_Advance_Credit_card ={
"name": "HSBC Advance Credit card",
"minSpend": 0,
"maxSpend": 0,
"discFB": 0.015,
"discTravel": 0.015,
"discRetail": 0.015,
"discOnline": 0.015
}

UOB_One_Card = {
"name": "UOB One Card",
"minSpend": 0,
"maxSpend": 0,
"discFB": 0.05,
"discTravel": 0.10,
"discRetail": 0.05,
"discOnline": 0
}

Maybank_eVibes_Card = {
"name": "Maybank eVibes Card",
"minSpend": 0,
"maxSpend": 0,
"discFB": 0.01,
"discTravel": 0.07,
"discRetail": 0.01,
"discOnline": 0.01
}

Citi_SMRT_Card = {
"name": "Citi SMRT Card",
"minSpend": 0,
"maxSpend": 0,
"discFB": 0,
"discTravel": 0.05,
"discRetail": 0.003,
"discOnline": 0
}

card_data = [
    Standard_Chartered_smart_credit_card,
    HSBC_Advance_Credit_card,
    UOB_One_Card,
    Maybank_eVibes_Card,
    Citi_SMRT_Card,
]

#max and minimum expenditure
for i in range(len(card_data)):
    def recco_min(params):
        if spend_amount<card_data[i]["minSpend"]:
            cardlist[i]+=6
        elif card_data[i]["minSpend"]==None:
            cardlist[i]+=4            
        else:
            cardlist[i]+=4

    def recco_max(card):
        if spending_amount+total_spent>=0.75*card_data[i]["maxSpend"]:
            cardlist[i]+=4
        elif spending_amount+total_spent>=0.95*card_data[i]["maxSpend"]:
            cardlist[i]+=2
        elif card_data[i]["maxSpend"]==None:
            cardlist[i]+=6
        else:
            cardlist[i]+=6

#for FB Discounts/cashback
if spend_type == "fb":

    discfb=[card_data[0]["discFB"],card_data[1]["discFB"],card_data[2]["discFB"],card_data[3]["discFB"]]

    max_item_fb = 0
    max_item_fb_index = 0
    for i in range(len(discfb)):
        if  discfb[i] > max_item_fb:
            max_item_fb = discfb[i]
            max_item_index_fb = i

    for i in range(len(discfb)):
        if i == max_item_fb_index:
            cardlist[i]+=6
        else:
            cardlist[i]+=4

#for travel Discounts/cashback
elif spend_type == "travel":

    disctravel=[card_data[0]["discTravel"],card_data[1]["discTravel"],card_data[2]["discTravel"],card_data[3]["discTravel"]]

    max_item_travel = 0
    max_item_travel_index = 0
    for i in range(len(disctravel)):
        if  disctravel[i] > max_item_travel:
            max_item_travel = disctravel[i]
            max_item_travel_index = i

    for i in range(len(disctravel)):
        if i == max_item_travel_index:
            cardlist[i]+=6
        else:
            cardlist[i]+=4

#for retail Discounts/cashback        
elif spend_type == "retail":

    discretail=[card_data[0]["discRetail"],card_data[1]["discRetail"],card_data[2]["discRetail"],card_data[3]["discRetail"]]

    max_item_retail = 0
    max_item_retail_index = 0
    for i in range(len(discretail)):
        if  discretail[i] > max_item_retail:
            max_item_retail = discretail[i]
            max_item_retail_index = i

    for i in range(len(discretail)):
        if i == max_item_retail_index:
            cardlist[i]+=6
        else:
            cardlist[i]+=4

#for retail Discounts/cashback        
elif spend_type == "online":

    disconline=[card_data[0]["discOnline"],card_data[1]["discOnline"],card_data[2]["discOnline"],card_data[3]["discOnline"]]

    max_item_online = 0
    max_item_online_index = 0
    for i in range(len(disconline)):
        if  disconline[i] > max_item_online:
            max_item_online = disconline[i]
            max_item_online_index = i

    for i in range(len(disconline)):
        if i == max_item_online_index:
            cardlist[i]+=6
        else:
            cardlist[i]+=4

#finale
max_item_result = 0
max_item_result_index = 0
for i in range(len(cardlist)):
    if cardlist[i] > max_item_result:
        max_item_result = cardlist[i]
        max_item_result_index = i

#savings
def spend_json(spend_type):
    if spend_type=="fb":
        return "discFB"
    elif spend_type=="travel":
        return "discTravel"
    elif spend_type=="retail":
        return "discRetail"
    elif spend_type=="online":
        return "discOnline"
    return "nil"

spend_json_1=spend_json(spend_type)
#print(spend_json_1)
#print(spend_type)
savings=(card_data[max_item_result_index][spend_json_1])*spending_amount
#print("I recommend that you use "+card_data[max_item_result_index]["name"])
#print("This is because "+card_data[max_item_result_index]["name"]+" offers the best savings for "+spend_type+" as compared to all your other cards.")
#print("You will save a total of $"+str(savings))

print({
    "CardRecco":card_data[max_item_result_index]["name"],
    "SpendType":spend_type,
    "Savings":savings
})
`

export default getCode
