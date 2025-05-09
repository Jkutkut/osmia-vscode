import setupLanguageSyntax from "./languageSyntax";

export const initSettings = async () => {
  Promise.all([
    setupLanguageSyntax()
  ])
};
