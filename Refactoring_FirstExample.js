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

// STOP AT: At the moment, I'm just making a copy of the performance object,
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        return result;
    }

    function renderPlainText(data, plays) {
        let result = `Statement for ${data.customer}\n`;
        for (let perf of data.performances) {
            // print line for this order
            result += `  ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats) \n`;
        }

        result += `Amount owed is ${usd(totalAmount(data) / 100)} \n`;
        result += `You earned ${totalVolumeCredits()} credits\n`;
        return result;

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

        function usd(aNumber) {
            return new Intl.NumberFormat("en-US",
                {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 2
                }).format(aNumber);
        }

        function totalVolumeCredits() {
            let volumeCredits = 0;
            for (let perf of data.performances) {
                // add volume credits
                volumeCredits += volumeCreditsFor(perf)
            }
        }

        function totalAmount(data) {
            let result = 0;
            for (let perf of data.performances) {
                result += amountFor(perf);
            }
            return result
        }
    }

}

for (let invoice of invoices) {
    console.log(statement(invoice, plays))
}