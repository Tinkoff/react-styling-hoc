import React, { PureComponent } from 'react';
import pt from 'prop-types';

const mergeStyles = (styles, parentStyles) => {
    const components = [];

    const newStyles = styles.map(style => {
        components.push(style.component);

        return style;
    });

    parentStyles && parentStyles.forEach(style => {
        if (components.indexOf(style) === -1) {
            newStyles.push(style);
        }
    });

    return newStyles;
};

const propObj = {
    component: pt.element,
    themeStyles: pt.object,
    themeBlocks: pt.object,
    resetDefaultStyles: pt.bool
};

class ThemeProvider extends PureComponent {
    static propTypes = {
        children: pt.oneOfType([pt.element, pt.array]),
        themes: pt.arrayOf(pt.shape(propObj))
    };

    static defaultProps = {
        children: null,
        themes: []
    };

    static contextTypes = {
        themes: pt.arrayOf(pt.shape(propObj))
    };

    static childContextTypes = {
        themes: pt.arrayOf(pt.shape(propObj))
    };

    getChildContext() {
        const { themes } = this.props;
        const { themes: parentThemes } = this.context;

        return { themes: mergeStyles(themes, parentThemes) };
    }

    render() {
        return this.props.children;
    }
}

export default ThemeProvider;
