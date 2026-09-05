document.addEventListener("DOMContentLoaded", () => {
  const newsletter = document.querySelector(".newsletter");
  if (!newsletter) return;

  const eyebrow = newsletter.querySelector(".eyebrow");
  if (eyebrow) eyebrow.textContent = "SNAIL MAIL CLUB";

  const heading = newsletter.querySelector("h2");
  if (heading) heading.textContent = "Subscribe to the Snail Mail Club";

  const bodyCopy = newsletter.querySelector("p");
  if (bodyCopy) bodyCopy.textContent = "Postcards, studio notes, and tiny releases sent with care.";

  const action = Array.from(newsletter.querySelectorAll("a, button")).find((element) =>
    /join the den|join|letter/i.test(element.textContent || "")
  );
  if (action) {
    action.textContent = "meet the club →";
    action.setAttribute("href", "snail-mail-club.html");
  }
});
