import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import json

def load_data():
    data = pd.read_csv('Billionaires_Statistics_Dataset.csv')
    data['gdp_country'] = data['gdp_country'].replace('[\$,]', '', regex=True).astype(float)
    features = data[['cpi_country', 'gdp_country', 'gross_primary_education_enrollment_country', 'life_expectancy_country', 'total_tax_rate_country', 'population_country']]
    return features.dropna()

def standardize_data(data):
    scaler = StandardScaler()
    return scaler.fit_transform(data)

def perform_pca(data):
    pca = PCA(n_components=2)
    return pca, pca.fit_transform(data)

def get_loadings(pca, feature_names):
    return pd.DataFrame(pca.components_.T, columns=['PC1', 'PC2'], index=feature_names)

def save_pca_data(components, loadings):
    results = {
        "components": components.tolist(),
        "loadings": loadings.reset_index().rename(columns={'index': 'variable'}).to_dict(orient='records')
    }
    with open('pca_results.json', 'w') as outfile:
        json.dump(results, outfile)

def main():
    data = load_data()
    standardized_data = standardize_data(data)
    pca, principal_components = perform_pca(standardized_data)
    loadings = get_loadings(pca, data.columns)
    save_pca_data(principal_components, loadings)

if __name__ == "__main__":
    main()
