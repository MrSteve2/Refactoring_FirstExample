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

// STOP AT: Next, I move the volume credits calculation (compile-test-commit).
function statement(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredits = totalVolumeCredits(statementData)

    return renderPlainText(statementData, plays);

    function totalVolumeCredits(data) {
        return data.performances
            .reduce((total, p) => total + p.volumeCredits, 0)
    }

    function enrichPerformance(aPerformance) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(aPerformance);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result)
        return result;
    }
    function totalAmount(data) {
        return data.performances
            .reduce((total, p) => total + p.amount, 0)
    }

    function volumeCreditsFor(perf) {
        let result = 0;
        result += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
        return result
    }

    function playFor(aPerformance) {
        return plays[aPerformance.playID];
    }

    function amountFor(perf) {
        let result = 0;

        switch (perf.play.type) {
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
                throw new Error(`unknown type: ${perf.play.type}`);
        }
        return result;
    }


    function renderPlainText(data) {
        let result = `Statement for ${data.customer}\n`;
        for (let perf of data.performances) {
            // print line for this order
            result += `  ${perf.play.name}: ${usd(perf.amount / 100)} (${perf.audience} seats) \n`;
        }

        result += `Amount owed is ${usd(data.totalAmount / 100)} \n`;
        result += `You earned ${data.totalVolumeCredits} credits\n`;
        return result;

        function usd(aNumber) {
            return new Intl.NumberFormat("en-US",
                {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 2
                }).format(aNumber);
        }



    }
}

for (let invoice of invoices) {
    console.log(statement(invoice, plays))
}