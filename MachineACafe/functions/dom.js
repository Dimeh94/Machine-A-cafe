/**
 * Mes définitions
 * @typedef {title: string, duree: number} Etape
 * @property {string} title
 * @property {number} duree
 */


/**
 *
 * @param {string} tagName
 * @param {object} attributes
 * @return {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for (const [attribute, value] of Object.entries(attributes)) {
        element.setAttribute(attribute, value)
    }

    return element
}

/**
 * Injecte des éléments de type li
 * @param {[Etape]}lesEtapes
 * @param {HTMLElement}laListe
 */
export async function injectElements(lesEtapes, laListe) {
    for (let value of lesEtapes) {
        await delay(value.durée)
        let liListe = createElement('li')
        liListe.innerText = value.title
        laListe.append(liListe)
    }
}

/**
 * Supprime si nécessaire un tag, puis le recréé
 * @param {string} tagName
 * @return {HTMLElement}
 */
export function renewTag(tagName) {
    const laListe = document.querySelector(tagName)
    if (laListe !== null) {
        laListe.remove()
    }
    return createElement(tagName)
}

/**
 * Permet d'ajouter un délai avant un traitement
 * @param {Number} duree en ms
 * @return {Promise<unknown>}
 */
function delay(duree) {
    duree = duree || 2000;
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duree);
    });
}

