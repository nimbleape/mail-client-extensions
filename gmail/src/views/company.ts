import { buildView } from "./index";
import { buildPartnerActionView } from "./partner_actions";
import { updateCard } from "./helpers";
import { SOCIAL_MEDIA_ICONS, UI_ICONS } from "./icons";
import { createKeyValueWidget, actionCall, notify } from "./helpers";
import { URLS } from "../const";
import { State } from "../models/state";
import { Company } from "../models/company";

export function buildCompanyView(state: State, card: Card) {
    if (state.partner.company) {
        const odooServerUrl = State.odooServerUrl;
        const company = state.partner.company;

        const companySection = CardService.newCardSection().setHeader("<b>Company</b>");

        const companyContent = [company.email, company.phone]
            .filter((x) => x)
            .map((x) => `<font color="#777777">${x}</font>`);

        companySection.addWidget(
            createKeyValueWidget(
                null,
                company.name + "<br>" + companyContent.join("<br>"),
                company.image || UI_ICONS.no_company,
                null,
                null,
                company.id ? odooServerUrl + `/web#id=${company.id}&model=res.partner&view_type=form` : null,
                false,
                company.email,
                CardService.ImageCropType.CIRCLE,
            ),
        );

        _addSocialButtons(companySection, company);

        if (company.description) {
            companySection.addWidget(createKeyValueWidget("Description", company.description));
        }

        if (company.address) {
            companySection.addWidget(
                createKeyValueWidget(
                    "Address",
                    company.address,
                    UI_ICONS.location,
                    null,
                    null,
                    "https://www.google.com/maps/search/" + encodeURIComponent(company.address).replace("/", " "),
                ),
            );
        }

        if (company.phones) {
            companySection.addWidget(createKeyValueWidget("Phones", company.phones, UI_ICONS.phone));
        }

        if (company.website) {
            companySection.addWidget(
                createKeyValueWidget("Website", company.website, UI_ICONS.website, null, null, company.website),
            );
        }

        if (company.industry) {
            companySection.addWidget(createKeyValueWidget("Industry", company.industry, UI_ICONS.industry));
        }

        if (company.employees) {
            companySection.addWidget(
                createKeyValueWidget("Employees", company.employees + " employees", UI_ICONS.people),
            );
        }

        if (company.foundedYear) {
            companySection.addWidget(
                createKeyValueWidget("Founded Year", "" + company.foundedYear, UI_ICONS.foundation),
            );
        }

        if (company.tags) {
            companySection.addWidget(createKeyValueWidget("Keywords", company.tags, UI_ICONS.keywords));
        }

        if (company.companyType) {
            companySection.addWidget(createKeyValueWidget("Company Type", company.companyType, UI_ICONS.company_type));
        }

        if (company.annualRevenue) {
            companySection.addWidget(createKeyValueWidget("Annual Revenue", company.annualRevenue, UI_ICONS.money));
        }

        card.addSection(companySection);
    } else if (state.partner.id) {
        const companySection = CardService.newCardSection().setHeader("<b>Company</b>");
        companySection.addWidget(CardService.newTextParagraph().setText("No company attached to this contact."));

        if (state.error.canCreateCompany) {
            companySection.addWidget(
                CardService.newTextButton()
                    .setText("Create a company")
                    .setOnClickAction(actionCall(state, "onEnrichCompany")),
            );
        }
        card.addSection(companySection);
    }
}

function _addSocialButtons(section: CardSection, company: Company) {
    const socialMediaButtons = CardService.newButtonSet();

    const socialMedias = [
        {
            name: "Facebook",
            url: "https://facebook.com/",
            icon: SOCIAL_MEDIA_ICONS.facebook,
            key: "facebook",
        },
        {
            name: "Twitter",
            url: "https://twitter.com/",
            icon: SOCIAL_MEDIA_ICONS.twitter,
            key: "twitter",
        },
        {
            name: "LinkedIn",
            url: "https://linkedin.com/",
            icon: SOCIAL_MEDIA_ICONS.linkedin,
            key: "linkedin",
        },
        {
            name: "Github",
            url: "https://github.com/",
            icon: SOCIAL_MEDIA_ICONS.github,
            key: "github",
        },
        {
            name: "Crunchbase",
            url: "https://crunchbase.com/",
            icon: SOCIAL_MEDIA_ICONS.crunchbase,
            key: "crunchbase",
        },
    ];

    for (let media of socialMedias) {
        const url = company[media.key];
        if (url && url.length) {
            socialMediaButtons.addButton(
                CardService.newImageButton()
                    .setAltText(media.name)
                    .setIconUrl(media.icon)
                    .setOpenLink(CardService.newOpenLink().setUrl(media.url + url)),
            );
        }
    }

    section.addWidget(socialMediaButtons);
}
