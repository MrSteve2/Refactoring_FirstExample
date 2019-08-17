plays = {
    "hamlet": { "name": "Hamlet", "type": "tragedy" },
    "as-like": { "name": "As You Like It", "type": "comedy" },
    "othello": { "name": "Othello", "type": "tragedy" }
}

invoices = [
    {
        "customer": "BigCo",
        "performances": [
            {
                "playID": "hamlet",
                "audience": 55
            },
            {
                "playID": "as-like",
                "audience": 35
            },
            {
                "playID": "othello",
                "audience": 40
            }
        ]
    }
]


function statement(invoice, plays) {
    function amountFor(perf) {
        let result = 0;

        switch (playFor(perf).type) {
            case "tragedy":
                result = 40000;
                if (perf.audience > 30) {
                    result += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (perf.audience > 20) {
                    result += 10000 + 500 * (perf.audience - 20);
                }
                result += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${playFor(perf).type}`);
        }
        return result;
    }
    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        result += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
        return result
    }

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf, playFor(perf))
        // add volume credits
        volumeCredits += volumeCreditsFor(perf)

        // print line for this order
        result += `  ${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats) \n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)} \n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}


//console.log(statement(invoices, plays))
for (let invoice of invoices) {
    console.log(statement(invoice, plays))
}
// console.log(typeof(invoices.performances))
// console.dir(typeof(invoices, plays))
