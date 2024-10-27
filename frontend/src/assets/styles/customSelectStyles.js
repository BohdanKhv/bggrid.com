const CustomSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: 'var(--text-dark)',
        transition: 'var(--transition-duration)',
        padding: 15,
        color: state.isSelected ? 'var(--color-primary)' : 'var(--text-dark)',
        background: 'var(--color-main)',
        cursor: 'pointer',
        '&:hover': {
          background: 'var(--color-secondary)',
        },
    }),
    control: () => ({
        border: '1px solid var(--color-border)',
        background: 'var(--color-main)',
        fontWeight: '400',
        display: 'flex',
        fontSize: '16px',
        height: '47px',
        borderRadius: 'var(--border-radius)',
        cursor: 'pointer',
        transition: 'var(--transition-duration)',
        width: '100%',
        minWidth: '110px',
        fontFamily: 'inherit',
        '&:hover': {
          background: 'var(--color-secondary)',
        },
    }),
    menu: (provided) => ({
      ...provided,
    }),
    menuList: (provided) => ({
      ...provided,
      background: 'var(--color-main)',
      "&::-webkit-scrollbar-track": {
        display: "none",
        background: "var(--color-main)",
      },
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        const color = 'var(--text-dark)';

        return { ...provided, opacity, transition, color };
    }
  }

  export default CustomSelectStyles;