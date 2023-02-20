import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabPrevButton, TabNextButton } from "./TabsComponents";

const useStyles = makeStyles(theme => ({
  ul: {
    paddingHorizontal: 25,
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
          {t("Now you can open the downloaded template with your spreadsheet program")}.
        </TabParagraph>
        <TabParagraph>
          {t("There are 2 sheets: \"METADATI\" and \"ELENCO GARE\"")}.
          <br />
          {t("We advise you to start from the first sheet, \"METADATI\", and enter the 4 general data required:")}
          <ul className={classes.ul}>
            <li><i>{"codiceFiscaleStrutturaProponente"}</i> {t("the tax code of your company")}</li>
            <li><i>{"denominazioneStrutturaProponente"}</i> {t("the business name of your company")}</li>
            <li><i>{"annoRiferimento"}</i> {t("the reference year for which you will enter contracts")}</li>
            <li><i>{"urlFile"}</i> {t("the URL address where the final document will be published")}</li>
          </ul>
        </TabParagraph>
        <TabParagraph>
          {t("At this point you can move on to the second sheet, \"ELENCO GARE\"")}.<br />
          {t("Each contract (or \"tender\") must be entered, one per line")}.
        </TabParagraph>
        <TabParagraph>
          {t("The fields to fill in are:")}
          <ul className={classes.ul}>
            <li><i>{"CIG"}</i> {t("the Tender Identification Code: a unique code that identifies each tender")}</li>
            <li><i>{"OGGETTO"}</i> {t("the object of the tender")}</li>
            <li><i>{"SCELTA CONTRAENTE"}</i> {t("the type of contractor; it must be chosen from a predefined list, available in the sheet")}</li>
            <li><i>{"PARTECIPANTI / AGGREGATO o SINGOLO"}</i> {t("the type of participant: aggregate (A) or individual (S)")}</li>
            <li><i>{"PARTECIPANTI / COD. FISCALE o ID. ESTERO"}</i> {t("the participant's tax code (or foreign ID if not Italian)")}</li>
            <li><i>{"PARTECIPANTI / RAGIONE SOCIALE"}</i> {t("the partecipant's business name")}</li>
            <li><i>{"PARTECIPANTI / RUOLO"}</i> {t("the role of the participant; it must be chosen from a predefined list, available in the sheet")}</li>
            <li><i>{"AGGIUDICATARI"}</i> {t("indicates whether the participant(s) are awarded the contract (S), or not (empty)")}</li>
            <li><i>{"IMPORTO AGGIUDICAZIONE"}</i> {t("the contract award amount")}</li>
            <li><i>{"DATA INIZIO"}</i> {t("the date of the award of the contract")}</li>
            <li><i>{"DATA ULTIMAZIONE"}</i> {t("the date of completion of the contract")}</li>
            <li><i>{"IMPORTO DELLE SOMME LIQUIDATE"}</i> {t("the amount of the liquidated amount")}</li>
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
