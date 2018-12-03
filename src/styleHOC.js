import React, { Component } from 'react';
import pt from 'prop-types';

import find from '@tinkoff/utils/array/find';
import isEqual from '@tinkoff/utils/is/equal';

export const mergeStyles = (left, right) => {
    if (!right) {
        return left;
    }

    var result = Object.assign({}, left);
    var listsRight = Object.keys(right);

    for (var i = 0; i < listsRight.length; i++) {
        var nameStyle = listsRight[i];

        result[nameStyle] = result[nameStyle] ? `${result[nameStyle]} ${right[nameStyle]}` : right[nameStyle];
    }

    return result;
};

const propObj = {
    component: pt.element,
    themeStyles: pt.object,
    themeBlocks: pt.object,
    resetDefaultStyles: pt.bool
};

const styleHoc = styles => WrappedComponent => {
    const componentName = WrappedComponent.displayName || WrappedComponent.name;

    class Theme extends Component {
        static displayName = `Themed(${componentName})`;

        static propTypes = propObj;

        static contextTypes = {
            themes: pt.arrayOf(pt.shape(propObj))
        };

        constructor(props, context) {
            super(props);

            const { themeStyles, resetDefaultStyles } = this.getStyles(props, context);

            this.setStyles(themeStyles, resetDefaultStyles);
        }

        componentWillReceiveProps(nextProps) {
            const { themeStyles, resetDefaultStyles } = this.props;

            if (!isEqual(themeStyles, nextProps.themeStyles) || resetDefaultStyles !== nextProps.resetDefaultStyles) {
                this.setStyles(nextProps.themeStyles, nextProps.resetDefaultStyles);
            }
        }

        // имеет смысл смотреть в контекст только при первом рендере, т.к. дальнейших его изменений мы не увидим
        getStyles = ({ themeStyles, resetDefaultStyles }, context = this.context) => {
            const contextThemes = context.themes;

            const contextTheme = contextThemes && find(theme => theme && (this instanceof theme.component), contextThemes);

            this.themeBlocks = contextTheme && contextTheme.themeBlocks;

            return {
                themeStyles: themeStyles || contextTheme && contextTheme.themeStyles,
                resetDefaultStyles: resetDefaultStyles || contextTheme && contextTheme.resetDefaultStyles
            };
        };

        setStyles = (themeStyles, resetDefaultStyles) => {
            this.styles = resetDefaultStyles ?
                themeStyles :
                mergeStyles(styles, themeStyles);
        };

        render() {
            const { themeStyles, resetDefaultStyles, themeBlocks, ...props } = this.props;

            return <WrappedComponent
                {...props}
                styles={this.styles}
                themeBlocks={themeBlocks || this.themeBlocks}
            />;
        }
    }

    return Theme;
};

export default styleHoc;
