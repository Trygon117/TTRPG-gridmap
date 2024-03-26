import * as THREE from '/three';
let previewGrid;
let tiles = [];

// get the position we want to make a new tile
const getGridLoc = (position) => {
    const newGridSpot = new THREE.Vector3(0, 0, 0);
    if (position.x > 0) {
        newGridSpot.x = Math.trunc(position.x + .5);
    } else {
        newGridSpot.x = Math.trunc(position.x - .5);
    }
    newGridSpot.y = -.05;
    if (position.z > 0) {
        newGridSpot.z = Math.trunc(position.z + .5);
    } else {
        newGridSpot.z = Math.trunc(position.z - .5);
    }

    return newGridSpot;
}

// check if there is a tile in the given location
const tileExists = (GridLoc) => {
    let gridExists = false;
    for (const item of tiles) {
        if (item.tile.position.x == GridLoc.x && item.tile.position.y == GridLoc.y && item.tile.position.z == GridLoc.z) {
            gridExists = true;
        }
    }

    return gridExists;
}

export const previewTile = (scene, position) => {
    if (position == null) {
        return;
    }

    if (previewGrid) {
        scene.remove(previewGrid.tile);
        scene.remove(previewGrid.grid);
    }

    const newGridSpot = getGridLoc(position);

    if (tileExists(newGridSpot)) {
        return;
    }

    const geometry = new THREE.BoxGeometry(1, .1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "yellow" });
    previewGrid = { tile: new THREE.Mesh(geometry, material), grid: new THREE.GridHelper(3, 3) };
    previewGrid.tile.castShadow = true;
    previewGrid.tile.receiveShadow = true;
    previewGrid.tile.position.x = newGridSpot.x;
    previewGrid.tile.position.y = newGridSpot.y;
    previewGrid.tile.position.z = newGridSpot.z;

    previewGrid.grid.position.x = newGridSpot.x;
    previewGrid.grid.position.y = -.1;
    previewGrid.grid.position.z = newGridSpot.z;

    scene.add(previewGrid.tile);
    scene.add(previewGrid.grid);
}

export const setTile = (scene, position) => {
    if (position == null) {
        return;
    }

    const newGridSpot = getGridLoc(position);

    if (tileExists(newGridSpot)) {
        return;
    } else {
        scene.remove(previewGrid);
    }

    const geometry = new THREE.BoxGeometry(1, .1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "green" });
    const newTile = new THREE.Mesh(geometry, material);
    newTile.castShadow = true;
    newTile.receiveShadow = true;

    newTile.position.x = newGridSpot.x;
    newTile.position.y = newGridSpot.y;
    newTile.position.z = newGridSpot.z;

    const newGrid = new THREE.GridHelper(3, 3);
    newGrid.position.x = newGridSpot.x;
    newGrid.position.y = -.1;
    newGrid.position.z = newGridSpot.z;

    tiles.push({ tile: newTile, grid: newGrid });
    scene.add(newGrid);
    scene.add(newTile);
}

export const previewRemoveTile = (scene, position) => {
    if (position == null) {
        return;
    }

    if (previewGrid) {
        scene.remove(previewGrid.tile);
        scene.remove(previewGrid.grid);
    }

    const newGridSpot = getGridLoc(position);

    if (!tileExists(newGridSpot)) {
        return;
    }

    const geometry = new THREE.BoxGeometry(1, .1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "red" });
    previewGrid = { tile: new THREE.Mesh(geometry, material), grid: new THREE.GridHelper(3, 3) };
    previewGrid.tile.castShadow = true;
    previewGrid.tile.receiveShadow = true;
    previewGrid.tile.position.x = newGridSpot.x;
    previewGrid.tile.position.y = newGridSpot.y;
    previewGrid.tile.position.z = newGridSpot.z;

    previewGrid.grid.position.x = newGridSpot.x;
    previewGrid.grid.position.y = -.1;
    previewGrid.grid.position.z = newGridSpot.z;

    scene.add(previewGrid.tile);
    scene.add(previewGrid.grid);
}

export const removeTile = (scene, position) => {
    if (tiles.length <= 0) {
        return;
    }

    const selectedSpot = getGridLoc(position);

    // get the tile we are trying to remove
    let tileToRemove;
    for (const item of tiles) {
        if (item.tile.position.x == selectedSpot.x && item.tile.position.y == selectedSpot.y && item.tile.position.z == selectedSpot.z) {
            tileToRemove = item.tile;
            let gridToRemove = item.grid;
            scene.remove(tileToRemove);
            scene.remove(gridToRemove);
        }
    }

    if (tileToRemove) {
        tiles = tiles.filter((item) => {
            return item.tile.uuid != tileToRemove.uuid;
        });
    }
}

export const noPreview = (scene, position) => {
    if (previewGrid && previewGrid.tile && previewGrid.grid) {
        scene.remove(previewGrid.tile);
        scene.remove(previewGrid.grid);
    }
}