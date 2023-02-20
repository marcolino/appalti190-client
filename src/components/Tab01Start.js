import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TabContainer, TabBodyScrollable, TabTitle, TabParagraph, TabNextButton, TabTooltip } from "./TabsComponents";

function Tab01Start(props) {
  const { t } = useTranslation();
  const [ nextIsEnabled ] = useState(true);

  const onNext = () => {
    props.goto("next");
  };

  return (
    <TabContainer>
      <TabBodyScrollable>
        <TabTitle>
          {t("Welcome!")}
        </TabTitle>
        <TabParagraph>
          {t("This is our proposal to fulfill the requirements of the")} {" "}
          <a href="https://www.anticorruzione.it/-/adempimenti-legge-190/2012-art.-1-comma-32-7" target="legge190">
            {t("Legge 190")}
          </a>
          {"."} {t("We hope it is clear and simple to use")}.
          </TabParagraph>
        <TabParagraph>
          {t("This app will walk you through the few steps you need to complete the fulfillment successfully")}.
        </TabParagraph>
        <TabParagraph>
          {t("To get started you'll need to download an Excel template")}
          <TabTooltip
            title={t("It can be in MicroSoft-Excel format, or in ODS format") + "."}
          >
          </TabTooltip>
          {","} {t("which contains rules to guide you in the compilation, and minimize possible formal errors")}.
        </TabParagraph>
        <TabParagraph>
          {t("Then you will have to enter, one per line, all the goods or services that your structure has contracted out in the current year")}.
        </TabParagraph>
        <TabParagraph>
          {t("At the end of the year, generally by the end of January of the following year, it will be sufficient to upload the filled Excel sheet here")}.
        </TabParagraph>
        <TabParagraph>
          {t("At this point our system will carry out the formal check of the entered data")}.
          {t("In the event that some anomaly is reported, you will have to correct the reported anomalies in the Excel file, and then re-upload it")}.
        </TabParagraph>
        <TabParagraph>
          {t("You will then be able to download the XML document produced, which will be published on the site your structure refers to")}.
        </TabParagraph>
        <TabParagraph>
          {t("At this point you will have practically completed the fulfillment")}.
          {t("If you want, you can check - again on this site - the outcome of the verification by the ANAC")}.
        </TabParagraph>
        <TabParagraph>
          {t("Please note that we are always available to answer you for any doubts or uncertainties")}.
          {t("The assistance methods are different, from telephone support to email support, and also depend on the plan chosen")}.
          {t("References can be found in the menu under \"Support\"")}.
        </TabParagraph>
      </TabBodyScrollable>

      <div>
        <TabNextButton onNext={onNext} nextIsEnabled={nextIsEnabled}>
          {t("Continue")}
        </TabNextButton>
      </div>
    </TabContainer>
  );
}
Tab01Start.propTypes = {
  goto: PropTypes.func.isRequired,
};
Tab01Start.defaultProps = {
};

export default React.memo(Tab01Start);
