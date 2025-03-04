import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { compose } from 'recompose';
import Grid from 'src/components/Grid';
import Notice from 'src/components/Notice';
import PreferenceToggle, { ToggleProps } from 'src/components/PreferenceToggle';
import useFlags from 'src/hooks/useFlags';

interface Props {
  marginBottom?: 0 | 8 | 16 | 24 | undefined;
}

const VATBanner: React.FC<Props> = (props) => {
  const { marginBottom } = props;
  const flags = useFlags();
  const location = useLocation();

  const isBillingPage = location.pathname.match(/account[/]billing/);

  {
    /*
    launch darkly is responsible for determining who and who doesn't see this banner
    based on country information we send to the service in IdentifyUser.tsx

    As of Aug 14, 2019, this is the payload this component expects from LD

   {} || {
      tax_name: string;
      date: string;
    }
  */
  }
  if (flags.vatBanner && !!Object.keys(flags.vatBanner).length) {
    const { tax_name, date } = flags.vatBanner!;

    const taxNameToUpperCase = tax_name.toUpperCase();

    return (
      <PreferenceToggle<boolean>
        preferenceKey={`${tax_name.toLowerCase()}_banner_dismissed`}
        preferenceOptions={[true, false]}
      >
        {({
          preference: isDismissed,
          togglePreference: dismissBanner,
        }: ToggleProps<boolean>) => {
          return isDismissed ? (
            <React.Fragment />
          ) : (
            <Grid item xs={12}>
              <Notice
                warning
                dismissible={true}
                onClose={dismissBanner}
                important
                spacingBottom={marginBottom}
              >
                Starting {date}, {taxNameToUpperCase} may be applied to your
                Linode services. For more information, please see the{' '}
                <a
                  href="https://www.linode.com/docs/platform/billing-and-support/tax-information/"
                  target="_blank"
                  aria-describedby="external-site"
                  rel="noopener noreferrer"
                >
                  Tax Information Guide.
                </a>
                {!isBillingPage && (
                  <React.Fragment>
                    <br />
                    To ensure the correct {taxNameToUpperCase} is applied,
                    please verify your{' '}
                    <Link to="/account/billing">contact information</Link> is up
                    to date.
                  </React.Fragment>
                )}
              </Notice>
            </Grid>
          );
        }}
      </PreferenceToggle>
    );
  } else {
    return null;
  }
};

export default compose<Props, Props>(React.memo)(VATBanner);
