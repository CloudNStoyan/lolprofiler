let toast = {
    config: {
        container: document.body
    },
    create(text) {
        let toastWrapper = document.createElement('div');
        toastWrapper.className = "toast";

        let content = document.createElement('p');
        content.className = "content";
        content.innerText = text;
        toastWrapper.appendChild(content);

        this.config.container.appendChild(toastWrapper);
        let timeout = 2000;
        setTimeout(() => toastWrapper.classList.add("hide"), timeout)
        setTimeout(() => toastWrapper.classList.add("disappear"), timeout + 250);
        setTimeout(() => toastWrapper.remove(), timeout + 1000);
    }
}