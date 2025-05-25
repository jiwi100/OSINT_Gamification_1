document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const optionsArea = document.getElementById('options-area');
    let currentNodeId = 'start'; 

    // GEÄNDERT: displayNode Funktion, um HTML im Text zu erlauben (für Links)
    function displayNode(nodeId) {
        const node = dialogueTree[nodeId];
        if (!node) {
            console.error("Dialogknoten nicht gefunden:", nodeId);
            // Fallback zu einem sicheren Knoten, falls etwas schiefgeht
            currentNodeId = 'error_node'; 
            displayNode(currentNodeId);
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', `speaker-${node.speaker.toLowerCase()}`);
        messageDiv.innerHTML = node.text; // GEÄNDERT: .innerHTML statt .textContent
        chatLog.appendChild(messageDiv);

        chatLog.scrollTop = chatLog.scrollHeight;
        optionsArea.innerHTML = '';

        if (node.options && node.options.length > 0) {
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    currentNodeId = option.nextNodeId;
                    displayNode(currentNodeId);
                });
                optionsArea.appendChild(button);
            });
        }
    }

    const dialogueTree = {
        start: {
            speaker: "Alex",
            text: "Hey! Willkommen beim CyberSafe Chat. Ich bin Alex. Schon mal darüber nachgedacht, was für eine digitale Spur du jeden Tag im Netz hinterlässt?",
            options: [
                { text: "Ja, schon öfter.", nextNodeId: "response_ja" },
                { text: "Nicht wirklich, erzähl mal mehr!", nextNodeId: "response_nein" },
                { text: "Digitale Spur? Klingt nach Krimi!", nextNodeId: "response_krimi" }
            ]
        },
        response_ja: {
            speaker: "Alex",
            text: "Super, dann bist du ja schon sensibilisiert! Dann lass uns direkt tiefer eintauchen.",
            options: [ { text: "Okay, womit fangen wir an?", nextNodeId: "topic_osint_intro" } ]
        },
        response_nein: {
            speaker: "Alex",
            text: "Kein Problem, dafür bin ich ja da! Viele machen sich da gar keine großen Gedanken, aber es ist super wichtig.",
            options: [ { text: "Okay, womit fangen wir an?", nextNodeId: "topic_osint_intro" } ]
        },
        response_krimi: {
            speaker: "Alex",
            text: "Haha, ein bisschen Detektivarbeit ist tatsächlich dabei! Aber es geht darum, wie wir uns selbst schützen können.",
            options: [ { text: "Okay, womit fangen wir an?", nextNodeId: "topic_osint_intro" } ]
        },
        topic_osint_intro: {
            speaker: "Alex",
            text: "Wir sprechen heute über OSINT – Open Source Intelligence. Das sind Infos, die jeder mit ein paar Klicks über dich finden kann. Klingt erstmal harmlos, kann aber missbraucht werden. Bereit für ein kleines Gedankenexperiment dazu?",
            options: [
                { text: "Ja, ich bin gespannt!", nextNodeId: "gedankenexperiment_start" },
                { text: "Ich bin noch skeptisch.", nextNodeId: "gedankenexperiment_skeptisch" }
            ]
        },
        gedankenexperiment_start: {
            speaker: "Alex",
            text: "Perfekt! Stell dir vor, wir wollen Infos über eine fiktive Person 'Max Mustermann' finden. Wir starten mit dem ersten wichtigen Schritt: Googeln wir ihn doch mal!",
            options: [ { text: "Okay, wie machen wir das?", nextNodeId: "simulate_google_max" } ]
        },
        gedankenexperiment_skeptisch: {
            speaker: "Alex",
            text: "Verständlich. Aber glaub mir, es ist erstaunlich, was oft schon einfache Suchen ergeben. Lass uns das mal für 'Max Mustermann' durchspielen. Der erste Schritt: Googeln!",
            options: [ { text: "Na gut, zeig mal.", nextNodeId: "simulate_google_max" } ]
        },
        simulate_google_max: {
            speaker: "Alex",
            text: "Genau. Wir geben 'Max Mustermann' bei Google ein, vielleicht noch mit seiner Stadt 'Musterstadt'. Was könnten wir da sehen? Stell dir vor, auf den ersten Seiten finden wir: Sein LinkedIn-Profil, ein altes Xing-Profil und einen Artikel im Lokalblatt über seinen Schachclub. Das zeichnet schon ein erstes Bild, oder?",
            options: [
                { text: "Ja, das ist schon einiges.", nextNodeId: "ask_next_step_hibp" },
                { text: "Was fängt ein Angreifer damit an?", nextNodeId: "attacker_uses_google_info" }
            ]
        },
        attacker_uses_google_info: {
            speaker: "Alex",
            text: "Gute Frage! Allein das Wissen um den Arbeitgeber (LinkedIn/Xing) und Hobbys (Schachclub) kann für sehr gezielte Phishing-Mails genutzt werden, die dann viel überzeugender wirken.",
            options: [ { text: "Verstehe. Und was kommt als Nächstes?", nextNodeId: "ask_next_step_hibp" }]
        },
        ask_next_step_hibp: {
            speaker: "Alex",
            text: "Okay, wir haben Max gegoogelt. Als Nächstes wollen wir prüfen, ob seine E-Mail-Adresse vielleicht in bekannten Datenlecks aufgetaucht ist. Kennst du dafür ein Tool?",
            options: [
                { text: "Ja, Have I Been Pwned?", nextNodeId: "confirm_hibp" },
                { text: "Nein, welches denn?", nextNodeId: "introduce_hibp" }
            ]
        },
        confirm_hibp: {
            speaker: "Alex",
            text: "Exakt! Have I Been Pwned ist dafür super. Nehmen wir an, Max' E-Mail ist 'max.muster@beispiel.de'. Wir geben sie dort ein...",
            options: [ { text: "Und was finden wir (fiktiv)?", nextNodeId: "simulate_hibp_max" }]
        },
        introduce_hibp: {
            speaker: "Alex",
            text: "Ein sehr nützliches Tool dafür ist 'Have I Been Pwned'. Man gibt dort eine E-Mail-Adresse ein, z.B. 'max.muster@beispiel.de' von unserem Max...",
            options: [ { text: "Und was zeigt die Seite dann?", nextNodeId: "simulate_hibp_max" }]
        },
        simulate_hibp_max: {
            speaker: "Alex",
            text: "...und die Seite meldet uns (für unseren fiktiven Max): 'Oh no — pwned on 3 breached sites!' Das heißt, Max' E-Mail und wahrscheinlich auch Passwörter von diesen Diensten sind im Umlauf und für Kriminelle zugänglich.",
            options: [
                { text: "Das ist nicht gut!", nextNodeId: "ask_next_step_namecheckr" },
                { text: "Wie funktioniert die Seite genau?", nextNodeId: "explain_hibp_details" }
            ]
        },
        explain_hibp_details: {
            speaker: "Alex",
            text: "'Have I Been Pwned' sammelt und analysiert riesige Datenmengen aus bekannt gewordenen Hackerangriffen und Datenlecks. Man kann dort nachsehen, ob die eigenen Daten betroffen waren. Ziemlich nützlich, um gewarnt zu sein!",
            options: [ { text: "Verstanden. Was ist der nächste Schritt für Max?", nextNodeId: "ask_next_step_namecheckr" }]
        },
        ask_next_step_namecheckr: {
            speaker: "Alex",
            text: "Nach Google und dem E-Mail-Check könnten wir noch schauen, ob Max vielleicht einen typischen Nutzernamen hat, den er auf vielen Plattformen verwendet. Das ist der dritte wichtige Schritt.",
            options: [ { text: "Wie finden wir das raus?", nextNodeId: "introduce_namecheckr" }]
        },
        introduce_namecheckr: {
            speaker: "Alex",
            text: "Dafür gibt es Seiten wie 'Namecheckr'. Wenn Max zum Beispiel oft den Nutzernamen 'MaxTheGreat99' verwendet, könnten wir den dort eingeben.",
            options: [ { text: "Und was passiert dann?", nextNodeId: "simulate_namecheckr_max" }]
        },
        simulate_namecheckr_max: {
            speaker: "Alex",
            text: "Namecheckr würde uns dann anzeigen, auf welchen sozialen Netzwerken, Foren oder anderen Webseiten dieser Nutzername bereits registriert ist. So entdecken wir vielleicht noch weitere Online-Profile von unserem Max, die wir über Google nicht direkt gefunden haben.",
            options: [
                { text: "Das ist ja fast schon Detektivarbeit!", nextNodeId: "mention_exif_optional" },
                { text: "Praktisch, um auch eigene alte Accounts zu finden.", nextNodeId: "mention_exif_optional" }
            ]
        },
        mention_exif_optional: {
            speaker: "Alex",
            text: "Stimmt! Und für die ganz Technik-Interessierten gibt es noch einen optionalen Schritt: Wenn Max Fotos öffentlich postet, könnte man die Metadaten prüfen. Mit Tools wie 'exif.tools' findet man manchmal sogar GPS-Koordinaten vom Aufnahmeort. Schon etwas unheimlich, oder?",
            options: [ { text: "Okay, das waren jetzt viele Infos über Max!", nextNodeId: "prepare_self_check" } ]
        },
        prepare_self_check: {
            speaker: "Alex",
            text: "Genau. Wir haben jetzt (fiktiv natürlich) schon ein ganz gutes Bild von Max bekommen, nur mit diesen frei zugänglichen Methoden. Das zeigt, wie transparent wir oft sind. Aber keine Sorge, das Wichtigste ist, sich dessen bewusst zu sein und dann zu handeln!",
            options: [ { text: "Und wie kann ich das jetzt für mich selbst machen?", nextNodeId: "show_links_and_advice" } ]
        },
        show_links_and_advice: {
            speaker: "Alex",
            text: "Sehr gute Frage! Hier sind die Schritte und die wichtigsten Links, damit du das für dich selbst prüfen kannst:<br><br>" +
                    "1. <b>Google dich selbst:</b> Gib deinen Vor- und Nachnamen ein, optional mit Wohnort oder Arbeitgeber. Schau dir die ersten 2 Ergebnisseiten an.<br><br>" +
                    "2. <b>Überprüfe deine E-Mail-Adresse(n) auf Datenlecks:</b><br>" +
                    "   → Gehe zu <a href='https://haveibeenpwned.com' target='_blank'>haveibeenpwned.com</a><br>" +
                    "   → Gib deine private oder geschäftliche Mailadresse ein.<br><br>" +
                    "3. <b>Finde deine öffentlichen Profile (via Nutzernamen):</b><br>" +
                    "   → Öffne <a href='https://namecheckr.com' target='_blank'>namecheckr.com</a><br>" +
                    "   → Gib deinen Nutzernamen ein (falls du denselben auf mehreren Plattformen nutzt).<br><br>" +
                    "Optional für Technik-Affine: Wenn du Fotos hochgeladen hast, zieh eins z.B. in <a href='https://exif.tools/' target='_blank'>exif.tools</a> und prüfe, ob Metadaten wie GPS enthalten sind.<br><br>" +
                    "Nimm dir ruhig mal die Zeit dafür. Es ist wirklich erhellend!",
            options: [
                { text: "Super, danke Alex! Das mache ich.", nextNodeId: "final_goodbye" },
                { text: "Hast du noch einen letzten Tipp?", nextNodeId: "last_tip" }
            ]
        },
        last_tip: {
            speaker: "Alex",
            text: "Absolut! Mein wichtigster Tipp ist: Sei dir bewusst, was du teilst und mit wem. Du entscheidest, was sichtbar ist – nicht das Internet. Und jetzt: Viel Erfolg bei deinem Selbst-Check!",
            options: [ { text: "Danke, tschüss!", nextNodeId: "final_goodbye_alt" }]
        },
        final_goodbye: {
            speaker: "Alex",
            text: "Gern geschehen! Pass auf dich auf im digitalen Raum. Bis zum nächsten Mal beim CyberSafe Chat!",
            options: []
        },
        final_goodbye_alt: {
            speaker: "System",
            text: "Der Chat ist beendet. Du kannst das Fenster jetzt schließen.",
            options: []
        },
        error_node: { // NEU: Fallback-Knoten
            speaker: "System",
            text: "Hoppla, hier ist etwas schiefgelaufen im Dialog. Versuche, die Seite neu zu laden.",
            options: []
        }
    };

    // Initialen Dialogknoten anzeigen
    displayNode(currentNodeId);
});