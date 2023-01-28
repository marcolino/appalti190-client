import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";

const useStyles = makeStyles(theme => ({
  ul: {
    padding: 32,
  }
}));

function Tab03FillData(props) {
  const classes = useStyles();
  //const { auth } = useContext(AuthContext);
  const { t } = useTranslation();
  const [ prevIsEnabled ] = useState(true);
  const [ nextIsEnabled ] = useState(true);

  const onPrev = () => {
    props.goto("prev");
  };

  const onNext = () => {
    props.goto("next");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Fill your data")}
        </TabTitle>
        <TabParagraph>
          {/* TODO: translate all this text... */}
          Adesso puoi aprire il modello scaricato con il tuo programma di gestione fogli di lavoro.
        </TabParagraph>
        <TabParagraph>
          Sono presenti 2 fogli: "METADATI" ed "ELENCO GARE".
          <br />
          Ti consigliamo di iniziare dal primo foglio, "METADATI", ed inserire i 4 dati generali richiesti:
          <ul className={classes.ul}>
            <li><i>codiceFiscaleStrutturaProponente</i> il codice fiscale della tua struttura</li>
            <li><i>denominazioneStrutturaProponente</i> la ragione sociale della tua struttura</li>
            <li><i>annoRiferimento</i> l'anno di riferimento per cui inserirai gli appalti</li>
            <li><i>urlFile</i> l'indirizzo URL dove sarà pubblicato il documento finale</li>
          </ul>
        </TabParagraph>
        <TabParagraph>
          A questo punto puoi passare al secondo foglio, "ELENCO GARE".
          Occorre inserire ogni appalto (o "gara"), uno per riga.
        </TabParagraph>
        <TabParagraph>
          I campi da compilare sono:
          <ul className={classes.ul}>
            <li><i>CIG</i> il Codice Identificativo Gara</li>
            ... TODO: documentare tutti gli altri campi...
          </ul>
        </TabParagraph>
      </TabBodyScrollable>

      <Grid container>
        <Grid item xs={6}>
          <TabPrevButton onPrev={onPrev} prevIsEnabled={prevIsEnabled}>
            {t("Back")}
          </TabPrevButton>
        </Grid>
        <Grid item xs={6}>
          <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
            {t("Continue")}
          </TabNextButton>
        </Grid>
      </Grid>

    </TabContainer>
  );
}
Tab03FillData.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab03FillData.defaultProps = {
};

export default React.memo(Tab03FillData);
