def explain_result(score, reasons):

    if score >= 80:
        return "✅ This job looks safe. No major red flags detected."

    elif score >= 60:
        return "⚠️ Some suspicious signs found. Verify company details before proceeding."

    else:
        return "❌ High scam probability. Avoid payments or sharing personal information."