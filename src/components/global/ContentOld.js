import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FormAddProduct from './FormAddProduct'
import FormEditProduct from './FormEditProduct'
import './css/Content.css';
import { grey700 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';


class Content extends Component {
    constructor() {
        super();
        this.state = {
            products: null,
            categories: null,
            canSubmit: false,
            openEditProduct: false,
            productToEdit: null,
            productToDelete: null,
            openModalDeleteProduct: false
        }
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getAllCategories = this.getAllCategories.bind(this);
        this.addNewProduct = this.addNewProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.TriggerCloseEditProduct = this.TriggerCloseEditProduct.bind(this);
        this.handleOpenModalDeleteProduct = this.handleOpenModalDeleteProduct.bind(this);
        this.handleCloseModalDeleteProduct = this.handleCloseModalDeleteProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);

    }
    addNewProduct(model) {
        let self = this;
        axios.post('http://localhost:9001/products/create_product', { productName: model.newProductName, categoryId: model.newProductCategory, price: model.newProductPrice })
            .then(function (response) {
                //console.log(response);
                self.props.TriggerCloseNewProduct();
                self.getAllProducts();
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }
    editProduct(model) {
        //console.log(model);
        let self = this;
        axios.post('http://localhost:9001/products/update_product', { productId: model.editProductId, productName: model.editProductName, categoryId: model.editProductCategory, price: model.editProductPrice })
            .then(function (response) {
                //console.log(response);
                self.TriggerCloseEditProduct();
                self.getAllProducts();
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    deleteProduct() {
        let self = this;
        var productToDelete = self.state.productToDelete;
        axios.delete('http://localhost:9001/products/delete_product', { data: { productId: productToDelete.id } })
            .then(function (response) {
                self.handleCloseModalDeleteProduct();
                self.getAllProducts();
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    handleOpenModalDeleteProduct(model) {
        this.setState({
            productToDelete: model,
            openModalDeleteProduct: true
        })

    }

    handleCloseModalDeleteProduct() {
        this.setState({
            productToDelete: null,
            openModalDeleteProduct: false
        })
    }

    TriggerCloseEditProduct() {
        this.setState({
            openEditProduct: false,
            productToEdit: null
        })
    }

    TriggerOpenEditProduct(model) {
        this.setState({
            openEditProduct: true,
            productToEdit: model
        })
    }

    getAllProducts() {
        let self = this;
        axios.get('http://localhost:9001/products/get_product/0')
            .then(function (response) {
                self.setState({
                    products: response.data
                })
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    getAllCategories() {
        let self = this;
        axios.get('http://localhost:9001/products/get_category/0')
            .then(function (response) {
                self.setState({
                    categories: response.data
                })
            }).catch(function (error) {
                console.log("Hubo un error intentando obtener datos:");
                console.log(error);
            })
    }

    componentDidMount() {
        this.getAllProducts();
        this.getAllCategories();
    }
    render() {
        const actions = [
            <FlatButton
                label="Cancelar"
                primary={true}
                onTouchTap={this.handleCloseModalDeleteProduct}
            />,
            <FlatButton
                label="Eliminar"
                primary={true}
                onTouchTap={this.deleteProduct}
            />,
        ];

        var products = [];
        var categories = [];

        if (this.state.products) {
            products = this.state.products;
            //console.log(products);
        } else {
            products = []
        }

        if (this.state.categories) {
            categories = this.state.categories;
            //console.log(categories);
        }

        return (
            <div className="Content">
                <Card>
                    <CardHeader
                        title="Lista de Productos"
                        subtitle="en base de datos"
                    />
                    <CardText>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderColumn>ID</TableHeaderColumn>
                                    <TableHeaderColumn>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn>Precio</TableHeaderColumn>
                                    <TableHeaderColumn>Categoría</TableHeaderColumn>
                                    <TableHeaderColumn>Acciones</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product, i) =>
                                    <TableRow key={i}>
                                        <TableRowColumn>{product.id}</TableRowColumn>
                                        <TableRowColumn>{product.name}</TableRowColumn>
                                        <TableRowColumn>{product.price}</TableRowColumn>
                                        <TableRowColumn>{product.category.name}</TableRowColumn>
                                        <TableRowColumn style={{ overflow: 'visible' }}>
                                            <IconButton
                                                onClick={() => { this.TriggerOpenEditProduct(product) }}
                                                tooltip="Editar"
                                                iconStyle={{ color: grey700 }}
                                                iconClassName="material-icons"
                                                tooltipPosition={i < products.length - 1 ? 'bottom-center' : 'top-center'}
                                            >create
                                            </IconButton>
                                            <IconButton
                                                onClick={() => { this.handleOpenModalDeleteProduct(product) }}
                                                tooltip="Eliminar"
                                                iconStyle={{ color: grey700 }}
                                                iconClassName="material-icons"
                                                tooltipPosition={i < products.length - 1 ? 'bottom-center' : 'top-center'}
                                            >remove_circle
                                            </IconButton>
                                        </TableRowColumn>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </CardText>
                    <CardActions>
                        <FlatButton onClick={() => { this.getAllProducts(); }}>
                            Actualizar
                        </FlatButton>
                    </CardActions>
                </Card>
                {this.props.openAddNewProduct === true ? <FormAddProduct listOfCategories={categories} addNewProduct={this.addNewProduct} TriggerCloseNewProduct={this.props.TriggerCloseNewProduct} /> : ''}
                {this.state.openEditProduct === true ? <FormEditProduct productToEdit={this.state.productToEdit} editProduct={this.editProduct} TriggerCloseEditProduct={this.TriggerCloseEditProduct} listOfCategories={categories} /> : ''}

                <Dialog
                    title="Confirmar Eliminar"
                    actions={actions}
                    modal={false}
                    open={this.state.openModalDeleteProduct}
                    onRequestClose={this.handleCloseModalDeleteProduct}
                >
                    ¿Está seguro que desea eliminar este producto?
                </Dialog>
            </div>
        );
    }
}

export default Content;