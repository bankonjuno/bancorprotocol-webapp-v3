module.exports = function () {
  return function ({ addComponents, theme }) {
    const button = {};
    const base = {
      '@apply flex items-center justify-center px-30 rounded-full': '',
      '@apply outline-none focus:outline-none focus:ring-4': '',
      '@apply transition-all duration-300': '',
      fontWeight: theme('fontWeight.500'),
      height: '54px',
      fontSize: theme('fontSize.base'),
    };
    const baseDisabled = {
      '&:disabled': {
        opacity: 0.7,
        cursor: 'not-allowed',
      },
    };

    Object.keys(theme('colors')).forEach((key) => {
      if (!theme(`colors.${key}`)) return;
      button[`.btn-${key}`] = {
        ...base,
        backgroundColor: theme(`colors.${key}`).DEFAULT,
        color: theme('colors.white'),
        [`@apply focus:ring-${key}-500 focus:ring-opacity-50`]: '',
        '&:hover': {
          backgroundColor: theme(`colors.${key}`).DEFAULT,
        },
        '&:active': {
          backgroundColor: theme(`colors.${key}`).DEFAULT,
        },
        '&:disabled': {
          ...baseDisabled,
          backgroundColor: theme(`colors.${key}.500`),
        },
      };
    });

    Object.keys(theme('colors')).forEach((key) => {
      if (!theme(`colors.${key}`)) return;
      button[`.btn-outline-${key}`] = {
        ...base,
        backgroundColor: theme(`colors.transparent`),
        border: '2px solid',
        borderColor: theme(`colors.${key}`).DEFAULT,
        color: theme(`colors.${key}`).DEFAULT,
        '&:hover': {
          backgroundColor: theme(`colors.${key}`).DEFAULT,
          color: theme(`colors.white`),
        },
        '&:active': {
          backgroundColor: theme(`colors.${key}`).DEFAULT,
          color: theme(`colors.white`),
          borderColor: theme(`colors.${key}`).DEFAULT,
        },
        '&:disabled': {
          ...baseDisabled,
        },
      };
    });

    button[`.btn-secondary`] = {
      ...base,
      '@apply text-grey bg-fog': '',
      '@apply dark:text-graphite dark:bg-grey': '',
      '@apply focus:ring-grey focus:ring-opacity-50': '',
      '&:disabled': {
        ...baseDisabled,
      },
    };

    button[`.btn-outline-secondary`] = {
      ...base,
      '@apply text-charcoal bg-white': '',
      '@apply dark:text-silver dark:bg-black': '',
      '@apply focus:ring-grey focus:ring-opacity-50': '',
      '@apply border border-graphite': '',
      '&:disabled': {
        ...baseDisabled,
      },
    };

    const sizes = {
      sm: {
        '@apply text-12 h-28 px-20 focus:ring-2': '',
      },
      lg: {
        fontSize: theme('fontSize.18'),
        height: '44px',
      },
      xl: {
        fontSize: theme('fontSize.20'),
        height: '60px',
      },
    };

    Object.keys(sizes).forEach((key) => {
      button[`.btn-${key}`] = sizes[key];
    });

    addComponents(button);
  };
};
