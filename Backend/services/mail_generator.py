def generate_hr_reply(query: str):
    query = query.lower()

    if "company" in query:
        subject = "Request for Company Details"
        body = (
            "Dear HR,\n\n"
            "I would like to know more details about your company, "
            "its work culture, and the offered role.\n\n"
            "Kindly share the information.\n\n"
            "Thank you."
        )

    elif "salary" in query:
        subject = "Clarification Regarding Salary"
        body = (
            "Dear HR,\n\n"
            "Could you please clarify the salary structure and benefits "
            "for this position?\n\n"
            "Thank you."
        )

    else:
        subject = "Request for Information"
        body = (
            "Dear HR,\n\n"
            "I would like some additional information regarding the job opportunity.\n\n"
            "Thank you."
        )

    return subject, body